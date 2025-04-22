// controllers/entretienController.js
const { Entretien, Candidature, Offre } = require('../models');
const { Op } = require('sequelize');
const { creerNotification } = require('./notificationController');

exports.creerEntretien = async (req, res) => {
  try {
    const { id_offre, id_professionnel, date, heure_debut, heure_fin, type, lien_visio, notes } = req.body;
    const id_clinique = req.user.id_utilisateur;

    if (req.user.type_utilisateur !== 'clinique') {
      return res.status(403).json({ message: "Seules les cliniques peuvent planifier des entretiens." });
    }

    const candidatureValide = await Candidature.findOne({
      where: {
        id_offre,
        id_professionnel,
        statut: { [Op.in]: ['en_attente', 'acceptee'] }
      }
    });

    if (!candidatureValide) {
      return res.status(403).json({ message: "Impossible de planifier un entretien : la candidature n'est pas valide ou n'existe pas." });
    }

    const nouvelEntretien = await Entretien.create({
      id_offre,
      id_clinique,
      id_professionnel,
      date,
      heure_debut,
      heure_fin,
      type,
      lien_visio,
      notes,
      statut: 'prévu'
    });

    const offre = await Offre.findByPk(id_offre);
    await creerNotification({
      id_destinataire: id_professionnel,
      type_notification: "entretien",
      contenu: `Vous avez un nouvel entretien planifié le ${date} à ${heure_debut} pour l’offre "${offre.titre}".`
    });

    res.status(201).json(nouvelEntretien);

  } catch (err) {
    console.error("❌ Erreur lors de la création de l'entretien :", err);
    res.status(500).json({ message: "Erreur création entretien", error: err.message });
  }
};

exports.getEntretiensPourUtilisateur = async (req, res) => {
  const id = req.user.id_utilisateur;

  try {
    const entretiens = await Entretien.findAll({
      where: {
        [Op.or]: [
          { id_clinique: id },
          { id_professionnel: id }
        ]
      },
      order: [['date', 'ASC'], ['heure_debut', 'ASC']]
    });
    res.json(entretiens);
  } catch (err) {
    console.error("Erreur récupération entretiens :", err);
    res.status(500).json({ message: "Erreur récupération entretiens", error: err.message });
  }
};

exports.annulerEntretien = async (req, res) => {
  try {
    const entretien = await Entretien.findByPk(req.params.id);
    if (!entretien) return res.status(404).json({ message: "Entretien introuvable" });

    entretien.statut = 'annulé';
    await entretien.save();

    await creerNotification({
      id_destinataire: entretien.id_professionnel,
      type_notification: "entretien",
      contenu: `L’entretien prévu le ${entretien.date} à ${entretien.heure_debut} a été annulé par la clinique.`
    });

    res.json({ message: "Entretien annulé", entretien });
  } catch (err) {
    console.error("Erreur annulation entretien :", err);
    res.status(500).json({ message: "Erreur annulation entretien", error: err.message });
  }
};

exports.supprimerEntretien = async (req, res) => {
  try {
    const entretien = await Entretien.findByPk(req.params.id);
    if (!entretien) return res.status(404).json({ message: "Introuvable" });

    await creerNotification({
      id_destinataire: entretien.id_professionnel,
      type_notification: "entretien",
      contenu: `L’entretien prévu le ${entretien.date} a été supprimé.`
    });

    await entretien.destroy();
    res.json({ message: "Entretien supprimé" });
  } catch (err) {
    console.error("Erreur suppression entretien :", err);
    res.status(500).json({ message: "Erreur suppression entretien", error: err.message });
  }

  await Message.create({
    expediteur_id: id_clinique,               // l’utilisateur clinique qui crée l’entretien
    destinataire_id: id_professionnel,        // le professionnel concerné
    contenu: `📅 Un entretien a été planifié pour le ${date} de ${heure_debut} à ${heure_fin} (${type}). Merci de confirmer votre présence.`,
    id_offre,
    id_entretien: nouvelEntretien.id_entretien, // on associe l’entretien
    date_envoi: new Date(),
    est_lu: false
  });
};
