const express = require('express');
const router = express.Router();
const resetController = require('../controllers/resetPasswordController');
const resetControllerMobile = require('../controllers/resetPasswordControllerMobile');

// 📩 Demander une réinitialisation de mot de passe
// POST /api/reset/request
router.post('/request', resetController.demanderReinitialisation);

// 🔑 Confirmer la réinitialisation de mot de passe
// POST /api/reset/confirm
router.post('/confirm', resetController.confirmerReinitialisation);

// 📩 Envoi du code par e-mail
router.post('/request-code', resetControllerMobile.envoyerCodeReinitialisation);

// ✅ Vérification du code
router.post('/verify-code', resetControllerMobile.verifierCode);

// 🔐 Confirmation du nouveau mot de passe
router.post('/confirm-code', resetControllerMobile.confirmerReinitialisationAvecCode);

module.exports = router;