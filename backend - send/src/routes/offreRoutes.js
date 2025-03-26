const express = require('express');
const router = express.Router();
const { Offre, Candidature } = require('../models');

// Créer une offre de travail
router.post('/creer', async (req, res) => {
    try {
        const {
            id_clinique,
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

        // Validation des champs requis
        if (!id_clinique || !titre || !descript || !type_professionnel || !date_publication || !date_mission || !remuneration) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis' });
        }

        const nouvelleOffre = await Offre.create({
            id_clinique,
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

        console.log('Nouvelle offre créée:', nouvelleOffre);  // Affichage dans le terminal

        res.status(201).json(nouvelleOffre);
    } catch (error) {
        console.error('Erreur lors de la création de l’offre :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Accepter une offre (mettre à jour la candidature)
router.put('/accepter/:id', async (req, res) => {
    try {
        const id_candidature = req.params.id;

        const candidature = await Candidature.findByPk(id_candidature);
        if (!candidature) {
            return res.status(404).json({ message: 'Candidature introuvable' });
        }

        candidature.statut = 'acceptee';
        candidature.est_confirmee = 'Y';
        candidature.date_reponse = new Date();

        await candidature.save();

        console.log('Candidature acceptée:', candidature); // Affichage dans le terminal

        res.json({ message: 'Candidature acceptée avec succès', candidature });
    } catch (error) {
        console.error('Erreur lors de l’acceptation de la candidature :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
