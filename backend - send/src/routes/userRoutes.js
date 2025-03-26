const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route d'inscription
router.post('/register', userController.registerUser);

// Route de connexion
router.post('/login', userController.loginUser);

// Route de profil
router.get('/profile', userController.getProfile);

module.exports = router;