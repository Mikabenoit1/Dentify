const express = require('express');
const router = express.Router();
const {
  Offre,
  Candidature,
  User,
  CliniqueDentaire,
  ProfessionnelDentaire,
  Message
} = require('../models');
const protect = require('../middlewares/authMiddleware');
const { creerNotification } = require('../controllers/notificationController');

// ✅ Obtenir toutes les offres disponibles (publique)
router.get('/', async (req, res) => {
  try {
    const offres = await Offre.findAll({
      order: [['date_publication', 'DESC']]
    });
    res.json(offres);
  } catch (error) {
    console.error('Erreur lors de la récupération des offres :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Créer une offre de travail (réservé aux cliniques)
router.post('/creer', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    if (!utilisateur || utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent créer des offres." });
    }

    const clinique = await CliniqueDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });

    if (!clinique) {
      return res.status(400).json({ message: "Clinique introuvable pour cet utilisateur." });
    }

    const {
      titre, descript, type_professionnel, date_mission,
      heure_debut, heure_fin, duree_heures, remuneration,
      est_urgent, statut, competences_requises,
      latitude, longitude, adresse_complete, date_modification
    } = req.body;

    const nouvelleOffre = await Offre.create({
      id_clinique: clinique.id_clinique,
      titre,
      descript,
      type_professionnel,
      date_publication: new Date(),
      date_mission,
      heure_debut,
      heure_fin,
      duree_heures,
      remuneration,
      est_urgent,
      statut,
      competences_requises,
      latitude,
      longitude,
      adresse_complete,
      date_modification
    });

    res.status(201).json(nouvelleOffre);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l’offre :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Modifier une offre
router.put('/:id', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    if (!utilisateur || utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent modifier des offres." });
    }

    const offre = await Offre.findByPk(req.params.id);

    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    if (offre.id_clinique !== utilisateur.id_utilisateur) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier cette offre." });
    }

    const {
      titre, descript, type_professionnel, date_publication,
      date_mission, heure_debut, heure_fin, duree_heures,
      remuneration, est_urgent, statut, competences_requises,
      latitude, longitude, adresse_complete, date_modification
    } = req.body;

    Object.assign(offre, {
      titre, descript, type_professionnel, date_publication,
      date_mission, heure_debut, heure_fin, duree_heures,
      remuneration, est_urgent, statut, competences_requises,
      latitude, longitude, adresse_complete, date_modification
    });

    await offre.save();

    res.json({ message: 'Offre mise à jour avec succès', offre });
  } catch (error) {
    console.error('❌ Erreur lors de la modification de l’offre :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Archiver une offre
router.patch('/:id/archive', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    if (!utilisateur || utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent archiver des offres." });
    }

    const offre = await Offre.findByPk(req.params.id);

    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    if (offre.id_clinique !== utilisateur.id_utilisateur) {
      return res.status(403).json({ message: "Vous ne pouvez pas archiver cette offre." });
    }

    offre.statut = 'archivée';
    await offre.save();

    res.json({ message: 'Offre archivée avec succès', offre });
  } catch (error) {
    console.error('❌ Erreur lors de l\'archivage de l\'offre :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Accepter une candidature
router.put('/accepter/:id', protect, async (req, res) => {
  try {
    const id_candidature = req.params.id;

    const candidature = await Candidature.findByPk(id_candidature);
    if (!candidature) return res.status(404).json({ message: 'introuvable' });

    candidature.statut = 'acceptee';
    candidature.est_confirmee = 'Y';
    candidature.date_reponse = new Date();
    await candidature.save();

    const professionnel = await ProfessionnelDentaire.findByPk(candidature.id_professionnel);
    const utilisateurPro = professionnel ? await User.findByPk(professionnel.id_utilisateur) : null;
    const offre = await Offre.findByPk(candidature.id_offre);

    if (utilisateurPro && offre) {
      await creerNotification({
        id_destinataire: utilisateurPro.id_utilisateur,
        type: "offre",
        contenu: `Votre candidature à l’offre "${offre.titre}" a été acceptée !`
      });

      await Message.create({
        expediteur_id: req.user.id_utilisateur,
        destinataire_id: utilisateurPro.id_utilisateur,
        contenu: `🎉 Votre candidature pour "${offre.titre}" a été acceptée.`,
        id_offre: offre.id_offre,
        type_message: "systeme"
      });
    }

    res.json({ message: 'Candidature acceptée avec succès', candidature });
  } catch (error) {
    console.error('Erreur lors de l’acceptation de la candidature :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ❌ Refuser une candidature
router.put('/refuser/:id', protect, async (req, res) => {
  try {
    const id_candidature = req.params.id;
    const { message_reponse } = req.body;

    const candidature = await Candidature.findByPk(id_candidature);
    if (!candidature) return res.status(404).json({ message: 'Candidature introuvable' });

    candidature.statut = 'refusee';
    candidature.date_reponse = new Date();
    candidature.message_reponse = message_reponse || "Votre candidature n’a malheureusement pas été retenue.";
    await candidature.save();

    const professionnel = await ProfessionnelDentaire.findByPk(candidature.id_professionnel);
    const utilisateurPro = professionnel ? await User.findByPk(professionnel.id_utilisateur) : null;
    const offre = await Offre.findByPk(candidature.id_offre);

    if (utilisateurPro && offre) {
      const messageFinal = message_reponse || `Votre candidature à l’offre "${offre.titre}" n’a malheureusement pas été retenue.`;

      await creerNotification({
        id_utilisateur: utilisateurPro.id_utilisateur,
        type: "offre",
        contenu: messageFinal
      });

      await Message.create({
        expediteur_id: req.user.id_utilisateur,
        destinataire_id: utilisateurPro.id_utilisateur,
        contenu: messageFinal,
        id_offre: offre.id_offre,
        type_message: "systeme"
      });
    }

    res.json({ message: 'Candidature refusée avec succès', candidature });
  } catch (error) {
    console.error('Erreur lors du refus de la candidature :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
