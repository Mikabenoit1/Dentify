const express = require('express');
const router = express.Router();
const { CliniqueDentaire } = require('../models');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/photoUploadMiddleware'); // Unifié pour photos et logos

// ✅ Créer une clinique
router.post('/', async (req, res) => {
  try {
    const nouvelleClinique = await CliniqueDentaire.create(req.body);
    res.status(201).json(nouvelleClinique);
  } catch (error) {
    console.error('Erreur lors de la création de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Récupérer la clinique liée à l'utilisateur connecté
router.get('/profile', protect, async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: req.user.id_utilisateur } });

    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }

    res.status(200).json(clinique);
  } catch (error) {
    console.error("💥 Erreur dans GET /cliniques/profile:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Mettre à jour le profil de la clinique
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;

    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: userId } });
    if (!clinique) return res.status(404).json({ message: "Clinique non trouvée" });

    clinique.nom_clinique = req.body.nom || clinique.nom_clinique;
    clinique.adresse_complete = req.body.adresse || clinique.adresse_complete;
    clinique.ville = req.body.ville || clinique.ville;
    clinique.code_postal = req.body.codePostal || clinique.code_postal;
    clinique.telephone = req.body.telephone || clinique.telephone;
    clinique.email = req.body.email || clinique.email;
    clinique.site_web = req.body.siteWeb || clinique.site_web;
    clinique.description = req.body.description ?? clinique.description;
    clinique.specialites = req.body.specialites || clinique.specialites;
    clinique.services = req.body.services || clinique.services;
    clinique.equipement = req.body.equipement || clinique.equipement;
    clinique.equipe = req.body.equipe || clinique.equipe;
    clinique.horaires = req.body.horaires || clinique.horaires;
    clinique.logo = req.body.logo || clinique.logo;
    clinique.photos = req.body.photos || clinique.photos;

    await clinique.save();

    res.status(200).json(clinique);
  } catch (error) {
    console.error("Erreur update /cliniques/profile :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Upload du logo
router.post('/upload/logo', protect, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Fichier manquant (logo)" });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;

    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: req.user.id_utilisateur } });

    if (clinique) {
      clinique.logo = logoUrl;
      await clinique.save();
    }

    res.status(200).json({ logoUrl });
  } catch (error) {
    console.error('Erreur upload logo :', error);
    res.status(500).json({ message: 'Erreur upload logo' });
  }
});

// ✅ Upload d'une photo de galerie
router.post('/upload/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Fichier manquant (photo)" });
    }

    const photoUrl = `/uploads/photos/${req.file.filename}`;

    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: req.user.id_utilisateur } });

    if (clinique) {
      const photos = clinique.photos || [];
      photos.push(photoUrl);
      clinique.photos = photos;
      await clinique.save();
    }

    res.status(200).json({ photoUrl });
  } catch (error) {
    console.error('Erreur upload photo :', error);
    res.status(500).json({ message: 'Erreur upload photo' });
  }
});

module.exports = router;
