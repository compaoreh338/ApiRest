# API REST Sécurisée avec Express.js

Une API REST sécurisée construite avec Node.js et Express.js, incluant plusieurs fonctionnalités de sécurité.

## Fonctionnalités

- Express.js comme framework
- Body-parser pour le parsing JSON
- Nodemon pour le rechargement automatique
- Sécurité renforcée avec :
  - Helmet pour les en-têtes HTTP
  - CORS protection
  - Rate limiting
  - Gestion sécurisée des erreurs

## Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```
3. Copier le fichier `.env.example` vers `.env` et configurer les variables d'environnement
4. Démarrer le serveur :
```bash
# Mode développement avec Nodemon
npm run dev

# Mode production
npm start
```

## Variables d'environnement

- `PORT` : Port du serveur (défaut: 3000)
- `NODE_ENV` : Environnement (development/production)
- `JWT_SECRET` : Clé secrète pour JWT

## Sécurité

- Protection contre les attaques XSS via Helmet
- Rate limiting pour prévenir les attaques par force brute
- Validation des données entrantes
- Gestion sécurisée des erreurs
- Protection CORS 