const express = require('express');
const router = express.Router();
const { Candidature, ProfessionnelDentaire } = require('../models');
const protect = require('../middlewares/authMiddleware');

// ✅ POST : Créer une candidature (réservé aux professionnels)
router.post('/', protect, async (req, res) => {
  try {
    const utilisateurId = req.user.id_utilisateur;

    // Vérifie que c'est bien un professionnel
    const professionnel = await ProfessionnelDentaire.findOne({
      where: { id_utilisateur: utilisateurId }
    });

    if (!professionnel) {
      return res.status(403).json({ message: 'Seuls les professionnels peuvent postuler.' });
    }

    const { id_offre, message_personnalise } = req.body;

    const nouvelleCandidature = await Candidature.create({
      id_offre,
      id_professionnel: professionnel.id_professionnel,
      date_candidature: new Date(),
      message_personnalise,
      statut: 'en_attente',
      est_confirmee: 'N'
    });

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
