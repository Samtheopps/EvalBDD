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

---

## Architecture

### Communication entre microservices

- **Microservice 2** (Observation-Service) communique avec **Microservice 1** (Auth-Service) via HTTP pour :
  - Vérifier et décoder le JWT
  - Ajouter/retirer de la réputation aux utilisateurs
  - Récupérer les informations de l'utilisateur

### Services

- **rarityService.js** : Calcul automatique de l'indice de rareté
- **reputationService.js** : Gestion de la réputation inter-microservices

---

## Notes

> Ce projet simule un écosystème BDD collaboratif où les utilisateurs peuvent observer des espèces, les autres utilisateurs valident les observations, et un système de réputation encourage les contributions de qualité.

