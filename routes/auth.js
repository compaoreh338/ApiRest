const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);
        // Validation des données
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const [existingUsers] = await db.query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insérer l'utilisateur
        const [result] = await db.query(
            'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email }); // Log pour le débogage
        // Validation des données
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Vérifier si l'utilisateur existe
        const [users] = await db.query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Créer et signer le token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
        console.log(user);

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

router.put('/update', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email, currentPassword, newPassword, bio } = req.body;
        console.log('Update attempt for user:', userId);

        // Vérifier si l'utilisateur existe
        const [users] = await db.query(
            'SELECT * FROM Users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const user = users[0];
        const updates = [];
        const values = [];

        // Si un nouveau mot de passe est fourni, vérifier l'ancien
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Mot de passe actuel requis' });
            }

            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        // Mise à jour du nom d'utilisateur
        if (username && username !== user.username) {
            updates.push('username = ?');
            values.push(username);
        }

        // Mise à jour de l'email
        if (email && email !== user.email) {
            // Vérifier si le nouvel email est déjà utilisé
            const [existingUsers] = await db.query(
                'SELECT * FROM Users WHERE email = ? AND id != ?',
                [email, userId]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' });
            }

            updates.push('email = ?');
            values.push(email);
        }

        // Mise à jour de l'image si un fichier a été uploadé
        if (req.file) {
            const imageUrl = `/uploads/${req.file.filename}`;
            updates.push('image = ?');
            values.push(imageUrl);
        }

        // Mise à jour de la bio
        if (bio !== undefined) {
            updates.push('bio = ?');
            values.push(bio);
        }

        // Si aucune mise à jour n'est demandée
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Aucune modification à effectuer' });
        }

        // Ajouter l'ID à la fin des valeurs pour la clause WHERE
        values.push(userId);

        // Construire et exécuter la requête de mise à jour
        const query = `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`;
        await db.query(query, values);

        // Récupérer les informations mises à jour
        const [updatedUser] = await db.query(
            'SELECT id, username, email, image, bio FROM Users WHERE id = ?',
            [userId]
        );

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser[0]
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

module.exports = router;
