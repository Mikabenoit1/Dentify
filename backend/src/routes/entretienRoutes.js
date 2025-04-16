const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  creerEntretien,
  getEntretiensPourUtilisateur,
  annulerEntretien,
  supprimerEntretien
} = require('../controllers/entretienController');

// ✅ Créer un entretien (par une clinique uniquement)
router.post('/', protect, creerEntretien);

// ✅ Obtenir les entretiens liés à l'utilisateur connecté (clinique ou pro)
router.get('/', protect, getEntretiensPourUtilisateur);

// ✅ Modifier un entretien (ex. heure, visio, notes) — pour clinique ou professionnel impliqué
// ✅ Modifier un entretien (ex. heure, visio, notes) — pour clinique ou professionnel impliqué
router.put('/:id', protect, async (req, res) => {
    try {
      const { Entretien } = require('../models');
      const { creerNotification } = require('../controllers/notificationController');
  
      const entretien = await Entretien.findByPk(req.params.id);
  
      if (!entretien) {
        return res.status(404).json({ message: "Entretien introuvable" });
      }
  
      if (
        entretien.id_clinique !== req.user.id_utilisateur &&
        entretien.id_professionnel !== req.user.id_utilisateur
      ) {
        return res.status(403).json({ message: "Non autorisé à modifier cet entretien." });
      }
  
      await entretien.update(req.body);
  
      // 🔔 Notification au professionnel si modification
      await creerNotification({
        id_destinataire: entretien.id_professionnel,
        type_notification: "entretien",
        contenu: `L’entretien prévu le ${entretien.date} a été modifié. Veuillez vérifier les détails mis à jour.`
      });
  
      res.json({ message: "Entretien modifié avec succès", entretien });
  
    } catch (err) {
      console.error("❌ Erreur modification entretien :", err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  });
  

// ✅ Annuler un entretien (modifie le statut → annulé)
router.put('/annuler/:id', protect, annulerEntretien);

// ✅ Supprimer définitivement un entretien
router.delete('/:id', protect, supprimerEntretien);

module.exports = router;
