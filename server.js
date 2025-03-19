require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});

// Middlewares de sécurité
app.use(helmet()); // Sécurité des en-têtes HTTP
app.use(cors()); // Protection CORS
app.use(limiter); // Rate limiting
app.use(bodyParser.json()); // Parser pour JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API sécurisée' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Une erreur est survenue !',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne du serveur'
    });
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 