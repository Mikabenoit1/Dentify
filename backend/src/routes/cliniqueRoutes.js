const express = require('express');
const router = express.Router();
const { CliniqueDentaire } = require('../models');
const protect = require('../middlewares/authMiddleware');

// Route pour créer une clinique
router.post('/', async (req, res) => {
  try {
    const nouvelleClinique = await CliniqueDentaire.create(req.body);
    res.status(201).json(nouvelleClinique);
  } catch (error) {
    console.error('Erreur lors de la création de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une clinique par ID
router.get('/:id', protect, async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      return res.status(404).json({ message: "Clinique non trouvée." });
    }
    res.json(clinique);
  } catch (error) {
    console.error("Erreur lors du chargement de la clinique :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour une clinique
router.put('/:id', protect, async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      return res.status(404).json({ message: "Clinique non trouvée." });
    }
    await clinique.update(req.body); // Mettez à jour les champs modifiés
    res.json({ message: "Clinique mise à jour avec succès.", clinique });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la clinique :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
