const express = require('express');
const router = express.Router();
const { CliniqueDentaire } = require('../models');

// ✅ Route pour créer une clinique
router.post('/', async (req, res) => {
  try {
    const nouvelleClinique = await CliniqueDentaire.create(req.body);
    res.status(201).json(nouvelleClinique);
  } catch (error) {
    console.error('Erreur lors de la création de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Route pour obtenir une clinique PAR ID_UTILISATEUR
router.get('/:id', async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: req.params.id } });
    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }
    res.status(200).json(clinique);
  } catch (error) {
    console.error('Erreur lors de la récupération de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Route pour mettre à jour une clinique PAR ID_UTILISATEUR
router.put('/:id', async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: req.params.id } });
    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }
    await clinique.update(req.body);
    res.status(200).json(clinique);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
