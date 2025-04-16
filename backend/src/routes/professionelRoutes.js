const express = require('express');
const router = express.Router();
const { ProfessionnelDentaire } = require('../models');

// Route pour créer un professionnel dentaire
router.post('/', async (req, res) => {
  try {
    const nouveauProfessionnel = await ProfessionnelDentaire.create(req.body);
    res.status(201).json(nouveauProfessionnel);
  } catch (error) {
    console.error('Erreur lors de la création du professionnel dentaire :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour obtenir un professionnel dentaire par son ID
router.get('/:id', async (req, res) => {
  try {
    const professionnel = await ProfessionnelDentaire.findByPk(req.params.id);
    if (!professionnel) {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }
    res.status(200).json(professionnel);
  } catch (error) {
    console.error('Erreur lors de la récupération du professionnel dentaire :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour mettre à jour un professionnel dentaire
router.put('/:id', async (req, res) => {
  try {
    const professionnel = await ProfessionnelDentaire.findByPk(req.params.id);
    if (!professionnel) {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }
    await professionnel.update(req.body);
    res.status(200).json(professionnel);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du professionnel dentaire :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
