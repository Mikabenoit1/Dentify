// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  getNotifications,
  markAsRead
} = require('../controllers/notificationController');

// 🔔 Voir ses notifications
router.get('/:id_utilisateur', protect, getNotifications);

// ✅ Marquer une comme lue
router.put('/:id', protect, markAsRead);

module.exports = router;
