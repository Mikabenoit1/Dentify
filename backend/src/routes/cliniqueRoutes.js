const express = require('express');
const router = express.Router();
const { CliniqueDentaire } = require('../models');

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

module.exports = router;
