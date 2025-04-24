const express = require('express');
const router = express.Router();
const { Message, User, Offre } = require('../models');
const protect = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');
const {
  getConversations,
  getMessagesByConversation,
  createMessage,
  markAsRead,
  deleteMessage,
  getMessagesByUserAndOffre,
  getMessagesByUser
} = require('../controllers/messageController');

const { creerNotification } = require('../controllers/notificationController');

// Liste des conversations
router.get('/conversations', protect, getConversations);

// Messages d'une conversation
router.get('/conversations/:id_conversation/messages', protect, getMessagesByConversation);

// Envoyer un message
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

    // Pour les messages système, on adapte le contenu selon le type d'utilisateur
    let messageContenu = contenu;
    if (type_message === 'systeme') {
      const expediteur = await User.findByPk(req.user.id_utilisateur);
      const destinataire = await User.findByPk(destinataire_id);
      
      if (expediteur.type_utilisateur === 'professionnel' && contenu.includes('candidature')) {
        messageContenu = 'Nouvelle candidature envoyée';
      } else if (expediteur.type_utilisateur === 'clinique' && contenu.includes('candidature')) {
        messageContenu = 'Nouvelle candidature reçue';
      }
    }

    // Chercher une conversation existante pour cette offre entre ces utilisateurs
    let existingConversation = await Message.findOne({
      where: {
        id_offre,
        [Op.or]: [
          {
            expediteur_id: req.user.id_utilisateur,
            destinataire_id
          },
          {
            expediteur_id: destinataire_id,
            destinataire_id: req.user.id_utilisateur
          }
        ]
      },
      order: [['date_envoi', 'DESC']]
    });

    // Générer un id_conversation unique si c'est une nouvelle conversation
    let id_conversation;
    if (existingConversation) {
      id_conversation = existingConversation.id_conversation;
    } else {
      // Créer un id_conversation unique basé sur l'offre et les utilisateurs
      const userIds = [req.user.id_utilisateur, destinataire_id].sort().join('_');
      id_conversation = `conv_${id_offre}_${userIds}`;
    }

    const nouveauMessage = await Message.create({
      expediteur_id: req.user.id_utilisateur,
      destinataire_id,
      contenu: messageContenu,
      type_message: type_message || 'normal',
      id_offre,
      id_conversation,
      fichier_joint,
      date_envoi: new Date(),
      est_lu: false
    });

    // Récupérer le message complet avec les associations
    const messageComplet = await Message.findByPk(nouveauMessage.id_message, {
      include: [
        {
          model: User,
          as: 'expediteur',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'type_utilisateur']
        },
        {
          model: User,
          as: 'destinataire',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'type_utilisateur']
        },
        {
          model: Offre,
          as: 'offre',
          attributes: ['id_offre', 'titre']
        }
      ]
    });

    // Créer une notification pour les messages normaux
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

// Obtenir tous les messages avec un utilisateur (sans offre)
router.get('/:id_utilisateur', protect, getMessagesByUser);

// Obtenir les messages entre deux utilisateurs pour une offre
router.get('/:id_utilisateur/offre/:id_offre', protect, getMessagesByUserAndOffre);

// Marquer comme lu
router.put('/lu/:id', protect, markAsRead);

// Supprimer un message
router.delete('/:id', protect, deleteMessage);

module.exports = router;
