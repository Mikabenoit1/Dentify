// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const upload = require('../middlewares/uploadMiddleware');
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require('../controllers/userController');

const protect = require('../middlewares/authMiddleware');

const fs = require('fs');
const path = require('path');

// ✅ Créer un utilisateur (clinique ou professionnel)
router.post('/', registerUser);           // POST /api/users
router.post('/register', registerUser);   // POST /api/users/register

// ✅ Connexion
router.post('/login', loginUser);         // POST /api/users/login

// ✅ Récupérer son profil (auth requis)
router.get('/profile', protect, getProfile); // GET /api/users/profile

// ✅ Mettre à jour son profil (auth requis)
router.put('/profile', protect, updateProfile); // PUT /api/users/profile

// ✅ Upload de photo de profil
router.post('/upload/photo', protect, upload.single('photo'), async (req, res) => {
  console.log("Requête d'upload de photo reçue");
  console.log("Fichier:", req.file);
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    const user = await User.findByPk(req.user.id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Assurez-vous que le chemin est créé correctement
    const photoUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    console.log("Chemin de la photo:", photoUrl);
    
    user.photo_profil = photoUrl;
    await user.save();
    console.log("Utilisateur mis à jour:", user.toJSON());

    res.json({ 
      message: "Photo uploadée avec succès", 
      photoUrl 
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;