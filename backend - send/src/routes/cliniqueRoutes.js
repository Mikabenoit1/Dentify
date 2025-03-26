const express = require('express');
const router = express.Router();
const { CliniqueDentaire } = require('../models');

// Route pour créer une clinique
router.post('/', async (req, res) => {
  try {
    console.log('📥 Données reçues:', req.body); // Debug pour voir ce qui est envoyé

    const { nom_clinique, adresse, ville, province, code_postal, telephone } = req.body;

    // Vérification des champs obligatoires
    if (!nom_clinique || !adresse || !ville || !province || !code_postal) {
      return res.status(400).json({ message: 'Tous les champs (nom_clinique, adresse, ville, province, code_postal) sont obligatoires.' });
    }

    const nouvelleClinique = await CliniqueDentaire.create({
      nom_clinique,
      adresse,
      ville,
      province,
      code_postal,
      telephone
    });

    res.status(201).json(nouvelleClinique);
  } catch (error) {
    console.error('🔥 Erreur lors de la création de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
});

// Récupérer toutes les cliniques
router.get('/', async (req, res) => {
  try {
    const cliniques = await CliniqueDentaire.findAll();
    res.status(200).json(cliniques);
  } catch (error) {
    console.error('🔥 Erreur lors de la récupération des cliniques :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une clinique par ID
router.get('/:id', async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }
    res.status(200).json(clinique);
  } catch (error) {
    console.error('🔥 Erreur lors de la récupération de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour une clinique
router.put('/:id', async (req, res) => {
  try {
    console.log('📥 Données reçues pour mise à jour:', req.body);

    const { nom_clinique, adresse, ville, province, code_postal, telephone } = req.body;

    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }

    await clinique.update({ nom_clinique, adresse, ville, province, code_postal, telephone });
    res.status(200).json({ message: 'Clinique mise à jour', clinique });
  } catch (error) {
    console.error('🔥 Erreur lors de la mise à jour de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une clinique
router.delete('/:id', async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }

    await clinique.destroy();
    res.status(200).json({ message: 'Clinique supprimée' });
  } catch (error) {
    console.error('🔥 Erreur lors de la suppression de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
