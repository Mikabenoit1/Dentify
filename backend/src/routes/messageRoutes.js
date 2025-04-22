const express = require('express');
const router = express.Router();
const { Message, User, Offre } = require('../models');
const protect = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');
const messageController = require('../controllers/messageController');
const { creerNotification } = require('../controllers/notificationController');

// ✅ Envoyer un message
router.post('/', protect, async (req, res) => {
  try {
    const { destinataire_id, contenu, type_message, id_offre, fichier_joint } = req.body;
    console.log("📨 Création d'un nouveau message:", {
      expediteur_id: req.user.id_utilisateur,
      destinataire_id,
      contenu,
      type_message,
      id_offre
    });

    const nouveauMessage = await Message.create({
      expediteur_id: req.user.id_utilisateur,
      destinataire_id,
      contenu,
      type_message: type_message || 'normal',
      id_offre,
      fichier_joint
    });

    // Fetch the complete message with associations
    const messageComplet = await Message.findByPk(nouveauMessage.id_message, {
      include: [
        {
          model: User,
          as: 'expediteur',
          attributes: ['id_utilisateur', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'destinataire',
          attributes: ['id_utilisateur', 'nom', 'prenom']
        },
        {
          model: Offre,
          as: 'offre',
          attributes: ['id_offre', 'titre']
        }
      ]
    });

    // 📬 Créer une notification uniquement pour les messages "normaux"
    if ((type_message || 'normal') === 'normal') {
      const expediteur = await User.findByPk(req.user.id_utilisateur);

      await creerNotification({
        id_destinataire: destinataire_id,
        type_notification: 'message',
        contenu: `Nouveau message de ${expediteur.prenom} ${expediteur.nom}`
      });
    }

    console.log("✅ Message créé:", messageComplet);
    res.status(201).json(messageComplet);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ Voir la liste des conversations de l'utilisateur connecté
router.get('/conversations', protect, async (req, res) => {
  try {
    const id = req.user.id_utilisateur;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: id },
          { destinataire_id: id }
        ]
      },
      attributes: ['expediteur_id', 'destinataire_id'],
      raw: true
    });

    const interlocuteurs = new Set();
    messages.forEach(msg => {
      if (msg.expediteur_id !== id) interlocuteurs.add(msg.expediteur_id);
      if (msg.destinataire_id !== id) interlocuteurs.add(msg.destinataire_id);
    });

    const utilisateurs = await User.findAll({
      where: { id_utilisateur: Array.from(interlocuteurs) },
      attributes: ['id_utilisateur', 'nom', 'prenom', 'courriel', 'type_utilisateur']
    });

    res.json(utilisateurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Obtenir les messages avec un utilisateur donné pour une offre précise
router.get('/:id_utilisateur/offre/:id_offre', protect, async (req, res) => {
  try {
    const id_utilisateur = parseInt(req.params.id_utilisateur);
    const id_offre = parseInt(req.params.id_offre);
    const monId = req.user.id_utilisateur;

    console.log("🔍 Recherche des messages avec paramètres:", {
      id_utilisateur,
      id_offre,
      monId
    });

    if (isNaN(id_utilisateur) || isNaN(id_offre)) {
      return res.status(400).json({ 
        message: "Les identifiants doivent être des nombres",
        params: { id_utilisateur: req.params.id_utilisateur, id_offre: req.params.id_offre }
      });
    }

    const messages = await Message.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { expediteur_id: monId, destinataire_id: id_utilisateur },
              { expediteur_id: id_utilisateur, destinataire_id: monId }
            ]
          },
          { id_offre }
        ]
      },
      order: [['date_envoi', 'ASC']],
      include: [
        {
          model: User,
          as: 'expediteur',
          attributes: ['id_utilisateur', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'destinataire',
          attributes: ['id_utilisateur', 'nom', 'prenom']
        },
        {
          model: Offre,
          as: 'offre',
          attributes: ['id_offre', 'titre']
        }
      ]
    });

    console.log(`✅ ${messages.length} messages trouvés:`, JSON.stringify(messages, null, 2));
    res.json(messages);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des messages filtrés :", error);
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ✅ Regrouper les messages par offre
router.get('/par-offre', protect, async (req, res) => {
  try {
    const utilisateurId = req.user.id_utilisateur;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: utilisateurId },
          { destinataire_id: utilisateurId }
        ]
      },
      order: [['id_offre', 'ASC'], ['date_envoi', 'ASC']],
      raw: true
    });

    const messagesParOffre = {};

    messages.forEach(msg => {
      const offreId = msg.id_offre || 'sans_offre';
      if (!messagesParOffre[offreId]) {
        messagesParOffre[offreId] = [];
      }
      messagesParOffre[offreId].push(msg);
    });

    res.json(messagesParOffre);
  } catch (error) {
    console.error('Erreur lors du regroupement des messages par offre :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Obtenir tous les messages avec un utilisateur donné (avec pagination et tri)
router.get('/:id_utilisateur', protect, async (req, res) => {
  try {
    const monId = req.user.id_utilisateur;
    const autreId = parseInt(req.params.id_utilisateur);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'date_envoi';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    const total = await Message.count({
      where: {
        [Op.or]: [
          { expediteur_id: monId, destinataire_id: autreId },
          { expediteur_id: autreId, destinataire_id: monId }
        ]
      }
    });

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: monId, destinataire_id: autreId },
          { expediteur_id: autreId, destinataire_id: monId }
        ]
      },
      order: [[sortBy, order]],
      limit,
      offset
    });

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      messages
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages paginés :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Modifier un message
router.put('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message || message.expediteur_id !== req.user.id_utilisateur) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce message' });
    }

    message.contenu = req.body.contenu || message.contenu;
    message.est_modifie = true;
    await message.save();

    res.json({ message: 'Message modifié avec succès', message });
  } catch (error) {
    console.error('Erreur lors de la modification du message :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Supprimer un message
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message || message.expediteur_id !== req.user.id_utilisateur) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce message' });
    }

    await message.destroy();
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Marquer un message comme lu
router.put('/lu/:id', protect, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message introuvable' });

    if (message.destinataire_id !== req.user.id_utilisateur) {
      return res.status(403).json({ message: 'Non autorisé à marquer ce message comme lu' });
    }

    message.est_lu = true;
    message.date_lecture = new Date();
    await message.save();

    res.json({ message: 'Message marqué comme lu', data: message });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
