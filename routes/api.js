const express = require('express');
const router = express.Router();

// Middleware d'authentification d'exemple
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    // Ajoutez ici votre logique d'authentification
    next();
};

// Routes protégées
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Route protégée' });
});

// Route publique
router.get('/public', (req, res) => {
    res.json({ message: 'Route publique' });
});

module.exports = router;