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

// Route pour obtenir une clinique par son ID
router.get('/:id', async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      console.warn("⚠️ Aucune clinique trouvée pour cet utilisateur");
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }

    // Fusionner les données utilisateur et clinique
    const profileData = {
      ...user.toJSON(),
      ...clinique.toJSON(),
      // S'assurer que ces champs sont bien présents même s'ils sont vides
      nom_clinique: clinique.nom_clinique || user.nom,
      email: user.courriel,
      telephone: clinique.telephone || '',
      specialites: clinique.specialites || [],
      services: clinique.services || [],
      description: clinique.description || '',
      horaires: clinique.horaires || {},
      equipement: clinique.equipement || [],
      equipe: clinique.equipe || [],
      logo: clinique.logo || '',
      photos: clinique.photos || []
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error("💥 Erreur dans GET /cliniques/profile:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour mettre à jour une clinique
router.put('/:id', async (req, res) => {
  try {
    const clinique = await CliniqueDentaire.findByPk(req.params.id);
    if (!clinique) {
      return res.status(404).json({ message: 'Clinique non trouvée' });
    }

    // Mise à jour des champs de l'utilisateur (si fournis)
    if (req.body.email) {
      user.courriel = req.body.email;
    }
    
    if (req.body.nom) {
      user.nom = req.body.nom;
      clinique.nom_clinique = req.body.nom;
    }
    
    if (req.body.adresse) {
      user.adresse = req.body.adresse;
    }
    
    if (req.body.ville) {
      user.ville = req.body.ville;
    }
    
    if (req.body.codePostal) {
      user.code_postal = req.body.codePostal;
    }

    // Mise à jour des champs spécifiques à la clinique
    if (req.body.adresse) {
      clinique.adresse_complete = req.body.adresse;
    }
    
    if (req.body.telephone) {
      clinique.telephone = req.body.telephone;
    }
    
    if (req.body.siteWeb) {
      clinique.site_web = req.body.siteWeb;
    }
    
    if (req.body.description !== undefined) {
      clinique.description = req.body.description;
    }
    
    // Champs de type JSON
    if (req.body.specialites) {
      clinique.specialites = req.body.specialites;
    }
    
    if (req.body.services) {
      clinique.services = req.body.services;
    }
    
    if (req.body.equipement) {
      clinique.equipement = req.body.equipement;
    }
    
    if (req.body.equipe) {
      clinique.equipe = req.body.equipe;
    }
    
    if (req.body.horaires) {
      clinique.horaires = req.body.horaires;
    }
    
    // Champs pour les médias
    if (req.body.logo) {
      clinique.logo = req.body.logo;
    }
    
    if (req.body.photos) {
      clinique.photos = req.body.photos;
    }

    // Sauvegarder les changements
    await user.save();
    await clinique.save();
    
    // Retourner les données mises à jour
    res.status(200).json({
      message: "✅ Profil de la clinique mis à jour avec succès",
      ...user.toJSON(),
      ...clinique.toJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil de clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /cliniques/upload/logo
router.post('/upload/logo', protect, upload.single('logo'), async (req, res) => {
  try {
    const logoUrl = `/uploads/documents/${req.file.filename}`;
    
    // Mettre à jour le logo dans la base de données
    const clinique = await CliniqueDentaire.findOne({ 
      where: { id_utilisateur: req.user.id_utilisateur } 
    });
    
    if (clinique) {
      clinique.logo = logoUrl;
      await clinique.save();
    }
    
    res.status(200).json({ logoUrl });
  } catch (error) {
    console.error('Erreur upload logo :', error);
    res.status(500).json({ message: 'Erreur upload' });
  }
});

// POST /cliniques/upload/photo
router.post('/upload/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const photoUrl = `/uploads/documents/${req.file.filename}`;
    
    // Ajouter la photo au tableau de photos
    const clinique = await CliniqueDentaire.findOne({ 
      where: { id_utilisateur: req.user.id_utilisateur } 
    });
    
    if (clinique) {
      const photos = clinique.photos || [];
      photos.push(photoUrl);
      clinique.photos = photos;
      await clinique.save();
    }
    
    res.status(200).json({ photoUrl });
  } catch (error) {
    console.error('Erreur upload photo :', error);
    res.status(500).json({ message: 'Erreur upload' });
  }
});

module.exports = router;