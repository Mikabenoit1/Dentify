const express = require('express');
const router = express.Router();
const {
  Candidature,
  ProfessionnelDentaire,
  CliniqueDentaire,
  Message,
  Offre
} = require('../models');
const protect = require('../middlewares/authMiddleware');
const { creerNotification } = require('../controllers/notificationController'); // ← Import du contrôleur

// ✅ POST : Créer une candidature (réservé aux professionnels)
router.post('/', protect, async (req, res) => {
  try {
    const utilisateurId = req.user.id_utilisateur;

    // 🔐 Vérifie que c'est un professionnel
    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: utilisateurId }
    });

    if (!professionnel) {
      return res.status(403).json({ message: 'Seuls les professionnels peuvent postuler.' });
    }

    const { id_offre, message_personnalise } = req.body;

    // 📝 Créer la candidature
    const nouvelleCandidature = await Candidature.create({
      id_offre,
      id_professionnel: professionnel.id_professionnel,
      date_candidature: new Date(),
      message_personnalise,
      statut: 'en_attente',
      est_confirmee: 'N'
    });

    // 💬 Créer un message automatique + notification
    const offre = await Offre.findByPk(id_offre);
    if (offre) {
      const clinique = await CliniqueDentaire.findByPk(offre.id_clinique);
      if (clinique && clinique.id_utilisateur) {
        // Message
        await Message.create({
          expediteur_id: utilisateurId,
          destinataire_id: clinique.id_utilisateur,
          contenu: message_personnalise || "📩 Nouvelle candidature envoyée",
          id_offre,
          type_message: "systeme"
        });

        // Notification
        await creerNotification({
          id_destinataire: clinique.id_utilisateur,
          type_notification: "candidature",
          contenu: `Vous avez reçu une nouvelle candidature pour l’offre "${offre.titre}"`
        });
      }
    }

    res.status(201).json(nouvelleCandidature);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la candidature :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ GET : Voir les candidatures d'un professionnel
router.get('/professionnel/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const candidatures = await Candidature.findAll({
      where: { id_professionnel: id }
    });
    res.status(200).json(candidatures);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
