const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require('../controllers/userController');

const protect = require('../middlewares/authMiddleware');

// ✅ Créer un utilisateur (clinique ou professionnel)
router.post('/', registerUser);           // POST /api/users
router.post('/register', registerUser);   // POST /api/users/register

// ✅ Connexion
router.post('/login', loginUser);         // POST /api/users/login

// ✅ Récupérer son profil (auth requis)
router.get('/profile', protect, getProfile); // GET /api/users/profile

// ✅ Mettre à jour son profil (auth requis)
router.put('/profile', protect, updateProfile); // PUT /api/users/profile

module.exports = router;
