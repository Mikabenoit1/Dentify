const express = require('express');
const router = express.Router();
const resetController = require('../controllers/resetPasswordController');

// 📩 Demander une réinitialisation de mot de passe
// POST /api/reset/request
router.post('/request', resetController.demanderReinitialisation);

// 🔑 Confirmer la réinitialisation de mot de passe
// POST /api/reset/confirm
router.post('/confirm', resetController.confirmerReinitialisation);

module.exports = router;