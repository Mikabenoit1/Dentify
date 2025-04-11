const express = require('express');
const router = express.Router();
const EvaluationController = require('../controllers/EvaluationController');

// Route pour créer une évaluation
router.post('/create', EvaluationController.createEvaluation);

// Route pour récupérer les évaluations d'une offre
router.get('/offre/:id_offre', EvaluationController.getEvaluationsByOffre);

// Route pour récupérer les évaluations d'un utilisateur (clinique ou professionnel)
router.get('/user/:id_utilisateur', EvaluationController.getEvaluationsByUser);

module.exports = router;
