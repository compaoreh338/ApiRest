const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/list', async (req, res) => {
    try {
        const query = 'SELECT * FROM Users';
        const results = await db.query(query);
        res.status(200).json({
            success: true,
            data: results[0],
            count: results[0].length
        });
        console.log(results);
    }
catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des utilisateurs',
        error: err.message
    });
}
});

module.exports = router;