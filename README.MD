# Architecture Microservices - BDD

## Microservice 1 : Auth-Service

### Structure du projet

- **Modèle utilisateur** : `models/user.js`
- **Contrôleur utilisateur** : `controllers/userController.js`
- **Routes utilisateur** : `routes/user.js`
- **Configuration de la base de données** : `config/database.js`
- **Serveur principal** : `app.js`
- **Middleware d'authentification** : `middlewares/authmiddlewares.js`
- **Contrôleur d'authentification** : `controllers/authController.js`
- **Routes d'authentification** : `routes/auth.js`

### Fonctionnalités

- Gestion des utilisateurs (CRUD)
- Authentification JWT
- Gestion des rôles (USER, EXPERT, ADMIN)
- Système de réputation

---

## Microservice 2 : Observation-Service

### Structure du projet

- **Modèles** : `models/Observation.js`, `models/Species.js`
- **Contrôleurs** : `controllers/observationController.js`, `controllers/speciesController.js`
- **Routes** : `routes/observationRoutes.js`, `routes/speciesRoutes.js`
- **Services** : `services/rarityService.js`, `services/reputationService.js`
- **Middleware** : `middleware/authmiddleware.js`, `middleware/role.js`
- **Configuration** : `config/database.js`
- **Serveur principal** : `app.js`

### Fonctionnalités minimales

#### Espèces
- `POST /species` - Créer une espèce
- `GET /species` - Lister toutes les espèces
- `GET /species/rarity/sorted` - Lister les espèces triées par rareté (décroissant)
- `GET /species/:id` - Récupérer une espèce

#### Observations
- `POST /observations` - Créer une observation
- `GET /species/:id/observations` - Lister les observations d'une espèce

#### Validation
- `POST /observations/:id/validate` - Valider une observation (EXPERT/ADMIN uniquement)
- `POST /observations/:id/reject` - Rejeter une observation (EXPERT/ADMIN uniquement)

#### Modération avancée (Niveau 16/20)
- `DELETE /admin/observations/:id` - Suppression logique (soft delete) d'une observation (ADMIN)
- `POST /admin/observations/:id/restore` - Restaurer une observation supprimée (ADMIN)
- `GET /admin/user/:id/history` - Historique des actions d'un utilisateur (ADMIN)
- `GET /expert/species/:id/history` - Historique d'une espèce (EXPERT/ADMIN)

---

## Microservice 3 : Taxonomy-Service (Niveau 16/20)

### Structure du projet

- **Contrôleurs** : `controllers/taxonomyController.js`
- **Routes** : `routes/taxonomyRoutes.js`
- **Services** : `services/observationService.js`
- **Configuration** : `config/database.js`
- **Serveur principal** : `app.js`

### Fonctionnalités

Service dédié à l'analyse et à la classification des espèces.

#### Endpoints
- `GET /taxonomy/stats` - Statistiques globales et classification

**Retourne :**
- Nombre total d'espèces
- Nombre total d'observations
- Nombre moyen d'observations par espèce
- Statistiques détaillées par espèce (observations validées/rejetées/en attente)
- Mots-clés récurrents des descriptions (analyse simple)
- Classification hiérarchique des espèces par famille (première lettre)

### Règles métier

- Impossible de valider sa propre observation
- Impossible de soumettre deux observations de la même espèce dans un délai de 5 minutes
- Impossible de créer deux espèces du même nom
- Description obligatoire pour une observation
- JWT obligatoire pour toutes les opérations

### Nouvelles fonctionnalités (Niveau 13/20)

#### 1. Indice de rareté automatique
- **Attribut** : `rarityScore` dans le modèle `Species`
- **Formule** : `rarityScore = 1 + (nombreObservationsValidées / 5)`
- **Mise à jour** : Automatique lors de la validation d'une observation
- **Endpoint** : `GET /species/rarity/sorted` pour trier les espèces par rareté

#### 2. Système de réputation basique
- **Observation validée** : +3 points à l'auteur
- **Observation rejetée** : -1 point à l'auteur
- **Validation par un EXPERT** : +1 point au validateur
- **Promotion automatique** : Un utilisateur avec réputation ≥ 10 devient EXPERT
- **Endpoint** : `POST /users/:id/reputation` (Microservice 1)

---

## Installation et lancement

### Prérequis

- Node.js v16+
- MongoDB Atlas avec une base de données `Aquaman`
- npm ou yarn

### Variables d'environnement

Créer un fichier `.env` à la racine et dans chaque microservice :

```env
# Root .env
JWT_SECRET=votre_clé_secrète_jwt
MICROSERVICE1_URL=http://localhost:3000
MICROSERVICE2_URL=http://localhost:3001
```

```env
# Microservice01/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=QvarryStorage
DB_NAME=Aquaman
PORT=3000
JWT_SECRET=votre_clé_secrète_jwt
```

```env
# Microservice02/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=QvarryStorage
DB_NAME=Aquaman
PORT=3001
JWT_SECRET=votre_clé_secrète_jwt
MICROSERVICE1_URL=http://localhost:3000
```

```env
# Microservice03/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=QvarryStorage
DB_NAME=Aquaman
PORT=3002
JWT_SECRET=votre_clé_secrète_jwt
MICROSERVICE2_URL=http://localhost:3001
```

### Lancement des microservices

```bash
# Microservice 1 (Auth-Service)
cd Microservice01
npm install
npm start

# Microservice 2 (Observation-Service) - dans un autre terminal
cd Microservice02
npm install
npm start

# Microservice 3 (Taxonomy-Service) - dans un autre terminal
cd Microservice03
npm install
npm start
```

---

## Exemples de requêtes Postman

### Authentication

**Créer un utilisateur**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "SecurePassword123",
    "role": "USER"
}
```

**Se connecter**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "SecurePassword123"
}
```

### Espèces

**Créer une espèce**
```bash
POST http://localhost:3001/species
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "name": "Lynx boréal"
}
```

**Lister les espèces triées par rareté**
```bash
GET http://localhost:3001/species/rarity/sorted
Authorization: Bearer YOUR_JWT_TOKEN
```

### Observations

**Créer une observation**
```bash
POST http://localhost:3001/observations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "speciesId": "SPECIES_ID",
    "description": "Aperçu d'un lynx dans la forêt boréale"
}
```

**Lister les observations d'une espèce**
```bash
GET http://localhost:3001/species/SPECIES_ID/observations
Authorization: Bearer YOUR_JWT_TOKEN
```

**Valider une observation (EXPERT/ADMIN)**
```bash
POST http://localhost:3001/observations/OBSERVATION_ID/validate
Authorization: Bearer YOUR_EXPERT_JWT_TOKEN
```

**Rejeter une observation (EXPERT/ADMIN)**
```bash
POST http://localhost:3001/observations/OBSERVATION_ID/reject
Authorization: Bearer YOUR_EXPERT_JWT_TOKEN
```

### Gestion de la réputation

**Ajouter/retirer de la réputation**
```bash
POST http://localhost:3000/api/users/:id/reputation
Content-Type: application/json

{
    "points": 3,
    "reason": "Observation validée"
}
```

### Modération avancée (Niveau 16/20)

**Suppression logique d'une observation (ADMIN)**
```bash
DELETE http://localhost:3001/admin/observations/OBSERVATION_ID
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Restaurer une observation supprimée (ADMIN)**
```bash
POST http://localhost:3001/admin/observations/OBSERVATION_ID/restore
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Historique des actions d'un utilisateur (ADMIN)**
```bash
GET http://localhost:3001/admin/user/USER_ID/history
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Historique d'une espèce (EXPERT/ADMIN)**
```bash
GET http://localhost:3001/expert/species/SPECIES_ID/history
Authorization: Bearer EXPERT_JWT_TOKEN
```

### Taxonomy Service (Niveau 16/20)

**Statistiques globales et classification**
```bash
GET http://localhost:3002/taxonomy/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Exemple de réponse :**
```json
{
  "totalSpecies": 10,
  "totalObservations": 45,
  "averageObservationsPerSpecies": 4.5,
  "speciesStats": [
    {
      "id": "67890abcdef",
      "name": "Lynx boréal",
      "observationCount": 12,
      "rarityScore": 3.4,
      "validatedCount": 10,
      "pendingCount": 2,
      "rejectedCount": 0
    }
  ],
  "keywords": [
    { "word": "forêt", "count": 15 },
    { "word": "observation", "count": 12 }
  ],
  "classification": {
    "L": [
      { "name": "Lynx boréal", "observationCount": 12 }
    ]
  }
}
```

---

## Architecture

### Communication entre microservices

- **Microservice 1** (Auth-Service) : Port 3000
  - Gestion des utilisateurs et authentification
  - Gestion de la réputation
  - Fournit le JWT pour les autres microservices

- **Microservice 2** (Observation-Service) : Port 3001
  - Gestion des espèces et observations
  - Validation/rejet des observations
  - Modération avancée avec soft delete et historisation
  - Communique avec Microservice 1 pour la gestion de la réputation

- **Microservice 3** (Taxonomy-Service) : Port 3002
  - Analyse et classification des espèces
  - Génération de statistiques globales
  - Extraction de mots-clés des descriptions
  - Communique avec Microservice 2 pour récupérer les données

### Services

- **rarityService.js** : Calcul automatique de l'indice de rareté
- **reputationService.js** : Gestion de la réputation inter-microservices
- **observationService.js** : Communication avec le service d'observation

### Modèles de données

**Microservice 1 :**
- `User` : email, username, password, role, reputation

**Microservice 2 :**
- `Species` : name, authorId, rarityScore, createdAt
- `Observation` : speciesId, authorId, description, status, validatedBy, validatedAt, deletedAt, deletedBy, createdAt
- `History` : targetType, targetId, action, performedBy, performedByRole, details, timestamp

### Fonctionnalités avancées (Niveau 16/20)

#### Soft Delete
- Les observations ne sont jamais vraiment supprimées de la base de données
- Un champ `deletedAt` indique si une observation est supprimée
- Seuls les ADMIN peuvent supprimer et restaurer des observations

#### Historisation
- Toutes les actions importantes sont enregistrées dans la collection `History`
- Actions trackées : création, validation, rejet, suppression, restauration
- Historique accessible par utilisateur ou par espèce

#### Taxonomy Service
- Analyse automatique des descriptions pour extraire les mots-clés
- Classification hiérarchique des espèces par famille (première lettre du nom)
- Statistiques détaillées par espèce avec status des observations

---

## Notes

> Ce projet simule un écosystème BDD collaboratif où les utilisateurs peuvent observer des espèces, les autres utilisateurs valident les observations, et un système de réputation encourage les contributions de qualité. Le système inclut maintenant un service de taxonomie pour l'analyse et la classification automatique.

