// src/controllers/conversationController.js
const { Op } = require('sequelize');
const { Conversation, Message, User } = require('../models');

//  Créer ou récupérer une conversation existante
const createOrGetConversation = async (req, res) => {
  try {
    const { destinataire_id, id_offre } = req.body;
    const expediteur_id = req.user.id_utilisateur;

    if (!destinataire_id) {
      return res.status(400).json({ message: "ID du destinataire requis." });
    }

    // Toujours mettre les ID dans le même ordre pour éviter les doublons
    const [utilisateur1_id, utilisateur2_id] =
      expediteur_id < destinataire_id
        ? [expediteur_id, destinataire_id]
        : [destinataire_id, expediteur_id];

    // Vérifie si la conversation existe déjà
    let conversation = await Conversation.findOne({
      where: {
        utilisateur1_id,
        utilisateur2_id,
        id_offre: id_offre || null
      }
    });

    // Ou en crée une nouvelle
    if (!conversation) {
      conversation = await Conversation.create({
        utilisateur1_id,
        utilisateur2_id,
        id_offre: id_offre || null
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error('❌ Erreur création/récupération conversation :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir toutes les conversations de l'utilisateur connecté
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { utilisateur1_id: userId },
          { utilisateur2_id: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'utilisateur1',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'photo_profil']
        },
        {
          model: User,
          as: 'utilisateur2',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'photo_profil']
        },
        {
          model: Message,
          limit: 1,
          order: [['date_envoi', 'DESC']]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(conversations);
  } catch (error) {
    console.error("❌ Erreur récupération des conversations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createOrGetConversation,
  getUserConversations
};
