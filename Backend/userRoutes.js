const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/userController'); // Vérifie bien ce chemin !

// Route pour l'inscription d'un utilisateur
router.post('/register', registerUser);

// Route pour la connexion d'un utilisateur
router.post('/login', loginUser);

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/profile', getProfile);

module.exports = router;
