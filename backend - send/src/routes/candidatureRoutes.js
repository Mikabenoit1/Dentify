const express = require('express');
const router = express.Router();
const { Offre, Candidature } = require('../models');

// POST : Créer une candidature (postuler à une offre)
router.post('/', async (req, res) => {
    try {
        const nouvelleCandidature = await Candidature.create(req.body);
        res.status(201).json(nouvelleCandidature);
    } catch (error) {
        console.error('Erreur lors de la création de la candidature :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET : Voir les candidatures d'un professionnel
router.get('/professionnel/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const candidatures = await Candidature.findAll({ where: { id_professionnel: id } });
      res.status(200).json(candidatures);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  module.exports = router;