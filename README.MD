# Microservice 1 : Auth-Service

## Structure du projet

- **Modèle utilisateur** : `models/user.js`
- **Contrôleur utilisateur** : `controllers/userController.js`
- **Routes utilisateur** : `routes/user.js`
- **Configuration de la base de données** : `config/database.js`
- **Serveur principal** : `app.js`
- **Middleware d'authentification** : `middlewares/authmiddlewares.js`
- **Contrôleur d'authentification** : `controllers/authController.js`
- **Routes d'authentification** : `routes/auth.js`

## Étapes de développement

1. Création du modèle `User` (structure, validation, rôles)
2. Développement du contrôleur utilisateur (CRUD)
3. Mise en place des routes utilisateur
4. Initialisation de la base MongoDB avec Mongoose
5. Création du serveur Express (`app.js`)
6. Ajout du middleware d'authentification (bcrypt, JWT, rôles)
7. Création du contrôleur d'authentification (inscription, connexion, profil)
8. Mise en place des routes d'authentification
9. Intégration de la logique d'authentification dans `app.js`
10. Tests des endpoints avec Postman (inscription, connexion, accès protégé)

## Test Postman

- Vérification de l'inscription et de la connexion
- Test des routes protégées avec Bearer Token
- Validation du fonctionnement global

---

> Ce microservice gère l'authentification, la gestion des utilisateurs et la sécurité des accès par rôles (USER, EXPERT, ADMIN).

