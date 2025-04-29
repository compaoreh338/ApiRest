const express = require('express');
const router = express.Router();
const db = require('../config/database');

// use multer for upload


// Get classes by teacher ID
router.get('/teacher/:teacherId/classes', async (req, res) => {
    const { teacherId } = req.params;
    console.log('Teacher ID:', teacherId);  // Juste pour vérifier que l'ID est correct

    // Vérification que l'ID est valide (optionnelle mais recommandée)
    if (!teacherId || isNaN(teacherId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid teacher ID.'
        });
    }

    try {
        // Requête pour récupérer les classes
        const query = `SELECT * FROM classe WHERE responsable_id = ?;`;
        const results = await db.query(query, [teacherId]);

        // Si des résultats sont trouvés
        if (results.length > 0) {
            console.log('Classes found:', results); // Affiche les résultats pour déboguer
            return res.status(200).json({
                success: true,
                message: 'Classes retrieved successfully',
                data: results,
                count: results.length  // Le nombre de classes
            });
        } else {
            // Si aucun résultat n'est trouvé
            return res.status(404).json({
                success: false,
                message: 'No classes found for this teacher.'
            });
        }
    } catch (err) {
        // Gestion des erreurs
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/', (req, res) => {
    res.json({ message: 'Route data' });
});



// get students by classId a
router.get('/classe/:classId/students', async (req, res) => {
    const { classId } = req.params;

    try {
        // Correction de la faute de frappe dans la requête SQL
        const result = await db.query(
            'SELECT s.* FROM Eleve s WHERE s.classe_id = ?', [classId]
        );

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: 'No students found for this class' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/retards', async (req, res) => {
    // On extrait les données envoyées dans la requête
    const { eleve_id, class_id, date, type, heure_arrivee } = req.body;

    if (!eleve_id || !class_id || !date || !type || !heure_arrivee) {
        return res.status(400).json({ success: false, message: 'Données manquantes' });
    }

    try {
        // Requête SQL pour insérer le retard
        const query = `
            INSERT INTO Retard (eleve_id, class_id, date, type, heure_arrivee)
            VALUES (?, ?, ?, ?, ?);
        `;

        // Exécution de la requête SQL pour insérer le retard
        await db.query(query, [eleve_id, class_id, date, type, heure_arrivee]);

        // Réponse de succès
        res.status(201).json({
            success: true,
            message: 'Retard enregistré avec succès.',
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du retard:', error);
        // Si une erreur se produit, on renvoie une erreur au client
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.post('/absences', async (req, res) => {
    // On extrait les données envoyées dans la requête
    const { eleve_id, class_id, date, type, heure_arrivee } = req.body;

    if (!eleve_id || !class_id || !date || !type || !heure_arrivee) {
        return res.status(400).json({ success: false, message: 'Données manquantes' });
    }

    try {
        // Requête SQL pour insérer le retard
        const query = `
            INSERT INTO Retard (eleve_id, class_id, date, type, heure_arrivee)
            VALUES (?, ?, ?, ?, ?);
        `;

        // Exécution de la requête SQL pour insérer le retard
        await db.query(query, [eleve_id, class_id, date, type, heure_arrivee]);

        // Réponse de succès
        res.status(201).json({
            success: true,
            message: 'Retard enregistré avec succès.',
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du retard:', error);
        // Si une erreur se produit, on renvoie une erreur au client
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.get('/total/:classId', async (req, res) => {
    const { classId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT SUM(CASE WHEN type = 'late' THEN 1 ELSE 0 END) AS total_retard,
                    SUM(CASE WHEN type = 'absence' THEN 1 ELSE 0 END) AS total_absence
             FROM Retard
             WHERE class_id = ?;`, [classId]
        );

        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                data: rows[0],
                count: rows[0].length
            });
        } else {
            res.status(404).json({ message: 'No attendance records found for this class' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
