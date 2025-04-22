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
const { getOffresProches, getCandidaturesParOffre } = require('../controllers/OffreController');


// Fonction de calcul de distance en km
function calculerDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ✅ Obtenir toutes les offres disponibles (filtrables)
router.get('/', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    let offres = await Offre.findAll({
      order: [['date_publication', 'DESC']]
    });

    // Si l'utilisateur est un professionnel, appliquer les filtres
    if (utilisateur && utilisateur.type_utilisateur === 'professionnel') {
      const professionnel = await ProfessionnelDentaire.findOne({
        where: { id_utilisateur: utilisateur.id_utilisateur }
      });

      if (!professionnel) {
        return res.status(400).json({ message: "Professionnel introuvable." });
      }

      const rayonKm = parseFloat(req.query.rayon) || null;         // ?rayon=15
      const type = req.query.type || null;                         // ?type=hygiéniste
      const salaireMin = parseFloat(req.query.salaire_min) || null; // ?salaire_min=40

      offres = offres.filter(offre => {
        const correspondanceType =
          !type || offre.type_professionnel === type;

        const correspondanceDistance =
          !rayonKm || (offre.latitude && offre.longitude &&
            calculerDistanceKm(
              professionnel.latitude,
              professionnel.longitude,
              offre.latitude,
              offre.longitude
            ) <= rayonKm);

        const correspondanceSalaire =
          !salaireMin || (offre.remuneration >= salaireMin);

        return correspondanceType && correspondanceDistance && correspondanceSalaire;
      });
    }

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
      titre, descript, type_professionnel, date_mission, date_debut, date_fin,
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
      date_debut,
      date_fin,
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
    console.error("❌ Erreur lors de la création de l'offre :", error);
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

    const clinique = await CliniqueDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });

    if (!clinique || offre.id_clinique !== clinique.id_clinique) {
      return res.status(403).json({ message: "Vous ne pouvez pas modifier cette offre." });
    }

    const {
      titre, descript, type_professionnel,
      date_mission, date_debut, date_fin,
      heure_debut, heure_fin, duree_heures,
      remuneration, est_urgent, statut, competences_requises,
      latitude, longitude, adresse_complete, date_modification
    } = req.body;

    Object.assign(offre, {
      titre, descript, type_professionnel,
      date_mission, date_debut, date_fin,
      heure_debut, heure_fin, duree_heures,
      remuneration, est_urgent, statut, competences_requises,
      latitude, longitude, adresse_complete,
      date_modification: date_modification || new Date()
    });

    // 🔐 Important : conserver la date_publication existante si elle existe
    if (!offre.date_publication) {
      offre.date_publication = new Date();
    }

    await offre.save();

    res.json({ message: 'Offre mise à jour avec succès', offre });
  } catch (error) {
    console.error("❌ Erreur lors de la modification de l'offre :", error);
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
    console.error("❌ Erreur lors de l'archivage de l'offre :", error);
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
        contenu: `Votre candidature à l'offre "${offre.titre}" a été acceptée !`
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
    console.error("Erreur lors de l'acceptation de la candidature :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Refuser une candidature
router.put('/refuser/:id', protect, async (req, res) => {
  try {
    const id_candidature = req.params.id;
    const { message_reponse } = req.body;

    const candidature = await Candidature.findByPk(id_candidature);
    if (!candidature) return res.status(404).json({ message: 'Candidature introuvable' });

    candidature.statut = 'refusee';
    candidature.date_reponse = new Date();
    candidature.message_reponse = message_reponse || "Votre candidature n'a malheureusement pas été retenue.";
    await candidature.save();

    const professionnel = await ProfessionnelDentaire.findByPk(candidature.id_professionnel);
    const utilisateurPro = professionnel ? await User.findByPk(professionnel.id_utilisateur) : null;
    const offre = await Offre.findByPk(candidature.id_offre);

    if (utilisateurPro && offre) {
      const messageFinal = message_reponse || `Votre candidature à l'offre "${offre.titre}" n'a malheureusement pas été retenue.`;

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
    console.error("Erreur lors du refus de la candidature :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Récupérer les candidatures pour une offre spécifique
router.get('/:id/candidatures', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);
    
    if (!utilisateur || utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent voir les candidatures de leurs offres." });
    }
    
    const offre = await Offre.findByPk(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée." });
    }
    
    const clinique = await CliniqueDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });
    
    if (!clinique || offre.id_clinique !== clinique.id_clinique) {
      return res.status(403).json({ message: "Vous ne pouvez pas accéder aux candidatures de cette offre." });
    }
    
    // Récupérer les candidatures avec les informations du professionnel
    const candidatures = await Candidature.findAll({
      where: { id_offre: offre.id_offre },
      include: [
        {
          model: ProfessionnelDentaire,
          attributes: ['id_professionnel', 'type_profession', 'annees_experience', 'specialites', 'competences'],
          include: [
            {
              model: User,
              attributes: ['id_utilisateur', 'nom', 'prenom', 'courriel', 'telephone', 'photo_profil']
            }
          ]
        }
      ],
      order: [['date_candidature', 'DESC']]
    });
    
    // Formater les données pour inclure le nom complet du professionnel
    const formattedCandidatures = candidatures.map(candidature => {
      const candiData = candidature.toJSON();
      
      // Si le professionnel existe, ajouter le nom complet
      if (candiData.ProfessionnelDentaire && candiData.ProfessionnelDentaire.User) {
        candiData.ProfessionnelDentaire.nom_complet = 
          `${candiData.ProfessionnelDentaire.User.prenom} ${candiData.ProfessionnelDentaire.User.nom}`;
        
        candiData.ProfessionnelDentaire.email = candiData.ProfessionnelDentaire.User.courriel;
        candiData.ProfessionnelDentaire.telephone = candiData.ProfessionnelDentaire.User.telephone;
      }
      
      return candiData;
    });
    
    res.json(formattedCandidatures);
    
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Récupérer les offres associées à la clinique connectée
router.get('/mes-offres', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    if (!utilisateur || utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent accéder à leurs offres." });
    }

    const clinique = await CliniqueDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });

    if (!clinique) {
      return res.status(404).json({ message: "Clinique introuvable" });
    }

    const offres = await Offre.findAll({
      where: { id_clinique: clinique.id_clinique },
      order: [['date_publication', 'DESC']]
    });

    res.json(offres);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des offres de la clinique :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Supprimer une offre
router.delete('/:id', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);

    if (!utilisateur || utilisateur.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent supprimer des offres." });
    }

    const offre = await Offre.findByPk(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée." });
    }

    // Vérifie que l'offre appartient bien à la clinique connectée
    const clinique = await CliniqueDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });

    if (!clinique || offre.id_clinique !== clinique.id_clinique) {
      return res.status(403).json({ message: "Vous ne pouvez pas supprimer cette offre." });
    }

    await offre.destroy();
    res.json({ message: "Offre supprimée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'offre:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/proches', protect, getOffresProches);

// Obtenir une offre par ID
router.get('/:id', protect, async (req, res) => {
  try {
    const offre = await Offre.findByPk(req.params.id);
    if (!offre) return res.status(404).json({ message: "Offre non trouvée." });

    const utilisateur = await User.findByPk(req.user.id_utilisateur);
    if (utilisateur.type_utilisateur === 'clinique') {
      const clinique = await CliniqueDentaire.findOne({
        where: { id_utilisateur: utilisateur.id_utilisateur }
      });

      if (!clinique || offre.id_clinique !== clinique.id_clinique) {
        return res.status(403).json({ message: "Accès interdit à cette offre." });
      }
    }

    res.json(offre);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'offre :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ Postuler à une offre (professionnel uniquement, une seule fois)
router.post('/postuler/:id', protect, async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.user.id_utilisateur);
    if (!utilisateur || utilisateur.type_utilisateur !== 'professionnel') {
      return res.status(403).json({ message: "Seuls les professionnels peuvent postuler." });
    }

    const offre = await Offre.findByPk(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre introuvable." });
    }

    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: utilisateur.id_utilisateur }
    });

    if (!professionnel) {
      return res.status(403).json({ message: "Professionnel introuvable." });
    }

    const dejaPostule = await Candidature.findOne({
      where: {
        id_professionnel: professionnel.id_professionnel,
        id_offre: offre.id_offre
      }
    });

    if (dejaPostule) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre." });
    }

    const nouvelleCandidature = await Candidature.create({
      id_professionnel: professionnel.id_professionnel,
      id_offre: offre.id_offre,
      date_candidature: new Date(),
      statut: 'pending'
    });

    res.status(201).json({ message: "✅ Candidature envoyée", candidature: nouvelleCandidature });
  } catch (error) {
    console.error("❌ Erreur lors de la postulation :", error);
    res.status(500).json({ message: "Erreur serveur lors de la postulation." });
  }
});

router.delete('/candidatures/:id', protect, async (req, res) => {
  try {
    const candidature = await Candidature.findByPk(req.params.id);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature introuvable." });
    }

    await candidature.destroy();

    res.status(200).json({ message: "Candidature retirée avec succès." });
  } catch (error) {
    console.error("Erreur lors du retrait de la candidature :", error);
    res.status(500).json({ message: "Erreur serveur lors du retrait de la candidature." });
  }
});

router.get('/offre/:id_offre/candidatures', getCandidaturesParOffre);




module.exports = router;