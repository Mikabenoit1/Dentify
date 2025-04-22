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

    const offreAssociee = await Offre.findByPk(id_offre);
      if (offreAssociee && offreAssociee.statut === 'pending') {
        offreAssociee.statut = 'active';
        await offreAssociee.save();
      }

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

// ✅ GET : Voir les candidatures de l'utilisateur connecté
router.get('/moi', protect, async (req, res) => {
  try {
    const utilisateurId = req.user.id_utilisateur;

    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: utilisateurId }
    });

    if (!professionnel) {
      return res.status(403).json({ message: 'Accès réservé aux professionnels.' });
    }

    const candidatures = await Candidature.findAll({
      where: { id_professionnel: professionnel.id_professionnel },
      include: [
        {
          model: Offre,
          include: [CliniqueDentaire]
        }
      ],
      order: [['date_candidature', 'DESC']]
    });

    res.status(200).json(candidatures);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des candidatures :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ GET : Voir les candidatures d'une offre avec détails complet du professionnel
router.get('/offres/:id/candidatures', async (req, res) => {
  try {
    const id = req.params.id;

    const candidatures = await Candidature.findAll({
      where: { id_offre: id },
      include: [
        {
          model: ProfessionnelDentaire,
          as: 'ProfessionnelDentaire',
          include: [
            {
              model: require('../models').User,
              as: 'Utilisateur',
              attributes: ['nom', 'prenom', 'courriel', 'telephone', 'photo_profil']
            }
          ]
        }
      ],
      order: [['date_candidature', 'DESC']]
    });

    res.json(candidatures);
  } catch (error) {
    console.error('❌ Erreur récupération candidatures offre:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ GET : Récupérer toutes les candidatures reçues par une clinique
router.get('/clinique/:id', protect, async (req, res) => {
  try {
    const id_clinique = req.params.id;

    const candidatures = await Candidature.findAll({
      include: {
        model: Offre,
        where: { id_clinique } // Filtrer les candidatures par les offres de la clinique
      }
    });

    res.status(200).json(candidatures);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des candidatures de la clinique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;
