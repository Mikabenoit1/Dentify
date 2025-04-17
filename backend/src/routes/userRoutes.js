const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require('../controllers/userController');
const { User } = require('../models');


const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const uploadPhoto = require('../middlewares/photoUploadMiddleware');




// ✅ Créer un utilisateur (clinique ou professionnel)
router.post('/', registerUser);           // POST /api/users
router.post('/register', registerUser);   // POST /api/users/register

// ✅ Connexion
router.post('/login', loginUser);         // POST /api/users/login

// ✅ Récupérer son profil (auth requis)
router.get('/profile', protect, getProfile); // GET /api/users/profile

// ✅ Mettre à jour son profil (auth requis)
router.put('/profile', protect, updateProfile); // PUT /api/users/profile

router.post('/upload/photo', protect, uploadPhoto.single('photo'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_utilisateur);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // On stocke juste le nom du fichier
    user.photo_profil = req.file.filename;
    await user.save();

    res.json({ message: "✅ Photo uploadée avec succès", photo_profil: req.file.filename });
  } catch (err) {
    console.error("Erreur upload photo:", err);
    res.status(500).json({ message: "Erreur serveur lors de l'upload de la photo" });
  }
});



module.exports = router;
