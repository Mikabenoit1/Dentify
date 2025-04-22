const express = require('express');
const router = express.Router();
const {
  Candidature,
  ProfessionnelDentaire,
  CliniqueDentaire,
  Message,
  Offre,
  User
} = require('../models');
const protect = require('../middlewares/authMiddleware');
const { creerNotification } = require('../controllers/notificationController'); // ← Import du contrôleur
const { Op } = require('sequelize');


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

    const { id_offre, message_personnalise, statut } = req.body;

    // 📝 Créer la candidature
    const nouvelleCandidature = await Candidature.create({
      id_offre,
      id_professionnel: professionnel.id_professionnel,
      date_candidature: new Date(),
      message_personnalise,
      statut: statut || 'en_attente',
      est_confirmee: statut === 'acceptee' ? 'Y' : 'N'
    });

    // 💬 Créer un message automatique + notification
    const offre = await Offre.findByPk(id_offre);
    if (offre) {
      const clinique = await CliniqueDentaire.findByPk(offre.id_clinique);
      if (clinique && clinique.id_utilisateur) {
        await Message.create({
          expediteur_id: utilisateurId,
          destinataire_id: clinique.id_utilisateur,
          contenu: message_personnalise ||
            (statut === 'acceptee'
              ? "✅ Offre directement acceptée par un professionnel"
              : "📩 Nouvelle candidature envoyée"),
          id_offre,
          type_message: "systeme"
        });

        await creerNotification({
          id_destinataire: clinique.id_utilisateur,
          type_notification: "candidature",
          contenu: statut === 'acceptee'
            ? `Un professionnel a directement accepté l’offre "${offre.titre}"`
            : `Vous avez reçu une nouvelle candidature pour l’offre "${offre.titre}"`
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

// ✅ GET : Voir les candidatures du professionnel connecté
router.get('/mes', protect, async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;

    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: userId }
    });

    if (!professionnel) {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }

    const candidatures = await Candidature.findAll({
      where: { id_professionnel: professionnel.id_professionnel }
    });

    res.status(200).json(candidatures);
  } catch (error) {
    console.error('❌ Erreur récupération candidatures /mes :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ DELETE : Retirer une candidature à partir de l'ID de l'offre
router.delete('/offre/:id_offre', protect, async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;
    const { id_offre } = req.params;

    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: userId }
    });

    if (!professionnel) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const candidature = await Candidature.findOne({
      where: {
        id_offre,
        id_professionnel: professionnel.id_professionnel
      }
    });

    if (!candidature) {
      return res.status(404).json({ message: 'Candidature introuvable' });
    }

    await candidature.destroy();
    res.json({ message: 'Candidature annulée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression candidature :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/horaire', protect, async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;

    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: userId }
    });

    if (!professionnel) {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }

    const candidatures = await Candidature.findAll({
      where: {
        id_professionnel: professionnel.id_professionnel,
        statut: 'acceptee',
        est_confirmee: 'Y'
      },
      include: [{
        model: Offre,
        where: {
          date_mission: { [Op.gt]: new Date() }
        },
        required: true,
        include: [{
          model: CliniqueDentaire,
          include: [{
            model: User,
            attributes: ['prenom', 'nom']
          }]
        }]
      }]
    });

    res.status(200).json(candidatures);
  } catch (error) {
    console.error("❌ Erreur /horaire :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/refuser/:id', protect, async (req, res) => {
  try {
    const id_candidature = req.params.id;
    const { message_reponse } = req.body;

    const candidature = await Candidature.findByPk(id_candidature);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature introuvable" });
    }

    candidature.statut = "refusee";
    candidature.message_reponse = message_reponse || "Votre candidature a été refusée.";
    candidature.date_reponse = new Date();

    await candidature.save();

    res.json({ message: "Candidature refusée avec succès", candidature });
  } catch (error) {
    console.error("❌ Erreur refus candidature :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
