const express = require('express');
const router = express.Router();
const { Offre, Candidature, User, CliniqueDentaire } = require('../models');
const protect = require('../middlewares/authMiddleware');

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
    console.log('🔐 Utilisateur ID extrait du token:', req.user.id_utilisateur);

    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent créer des offres." });
    }

    // 🏥 Trouver la clinique liée à cet utilisateur
    const clinique = await CliniqueDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });

    if (!clinique) {
      return res.status(400).json({ message: "Clinique introuvable pour cet utilisateur." });
    }

    const {
      titre,
      descript,
      type_professionnel,
      date_publication,
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
    } = req.body;

    const nouvelleOffre = await Offre.create({
      id_clinique: clinique.id_clinique, // ✅ Fixé ici
      titre,
      descript,
      type_professionnel,
      date_publication,
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

// ✅ Modifier une offre (réservé aux cliniques)
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
      titre,
      descript,
      type_professionnel,
      date_publication,
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
    } = req.body;

    offre.titre = titre || offre.titre;
    offre.descript = descript || offre.descript;
    offre.type_professionnel = type_professionnel || offre.type_professionnel;
    offre.date_publication = date_publication || offre.date_publication;
    offre.date_mission = date_mission || offre.date_mission;
    offre.heure_debut = heure_debut || offre.heure_debut;
    offre.heure_fin = heure_fin || offre.heure_fin;
    offre.duree_heures = duree_heures || offre.duree_heures;
    offre.remuneration = remuneration || offre.remuneration;
    offre.est_urgent = est_urgent || offre.est_urgent;
    offre.statut = statut || offre.statut;
    offre.competences_requises = competences_requises || offre.competences_requises;
    offre.latitude = latitude || offre.latitude;
    offre.longitude = longitude || offre.longitude;
    offre.adresse_complete = adresse_complete || offre.adresse_complete;
    offre.date_modification = date_modification || offre.date_modification;

    await offre.save();

    res.json({ message: 'Offre mise à jour avec succès', offre });
  } catch (error) {
    console.error('❌ Erreur lors de la modification de l’offre :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Archiver une offre (réservé aux cliniques)
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

    offre.statut = 'archivée'; // ou tout autre champ qui marquerait l'offre comme archivée
    await offre.save();

    res.json({ message: 'Offre archivée avec succès', offre });
  } catch (error) {
    console.error('❌ Erreur lors de l\'archivage de l\'offre :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Accepter une offre (mise à jour d'une candidature)
router.put('/accepter/:id', protect, async (req, res) => {
  try {
    const id_candidature = req.params.id;

    const candidature = await Candidature.findByPk(id_candidature);
    if (!candidature) {
      return res.status(404).json({ message: 'introuvable' });
    }

    candidature.statut = 'acceptee';
    candidature.est_confirmee = 'Y';
    candidature.date_reponse = new Date();

    await candidature.save();

    res.json({ message: 'Candidature acceptée avec succès', candidature });
  } catch (error) {
    console.error('Erreur lors de l’acceptation de la candidature :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
