// controllers/messageController.js
const { Message, Utilisateur, Offre, User } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

// Créer un nouveau message
const createMessage = async (req, res) => {
  try {
    console.log("📨 createMessage appelé");
    console.log("🧾 Corps reçu :", req.body);
    const {
      expediteur_id,
      destinataire_id,
      contenu,
      offre_id,
      id_conversation,
      meeting_id,
      fichier_joint
    } = req.body;

    const message = await Message.create({
      expediteur_id,
      destinataire_id,
      contenu,
      id_conversation,
      id_offre: offre_id,
      id_entretien: meeting_id || null,
      fichier_joint: fichier_joint || null,
      date_envoi: new Date(),
      est_lu: false
    });

    // Récupérer le message avec ses associations
    const messageComplet = await Message.findByPk(message.id_message, {
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

    res.status(201).json(messageComplet);
  } catch (error) {
    console.error('❌ Erreur lors de la création du message :', error);
    res.status(500).json({ error: 'Erreur lors de la création du message.' });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;

    // 1. D'abord, récupérer tous les messages système (postulations)
    const postulationMessages = await Message.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { expediteur_id: userId },
              { destinataire_id: userId }
            ]
          },
          {
            type_message: 'systeme',
            contenu: {
              [Op.like]: '%candidature%'
            }
          }
        ]
      },
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
      ],
      order: [['date_envoi', 'DESC']]
    });

    // 2. Créer un Map des conversations basé sur les postulations
    const conversationsMap = new Map();

    // Initialiser les conversations à partir des postulations
    for (const postulation of postulationMessages) {
      const otherUser = postulation.expediteur_id === userId
        ? postulation.destinataire
        : postulation.expediteur;

      const convKey = `${otherUser.id_utilisateur}_${postulation.id_offre}`;
      
      if (!conversationsMap.has(convKey)) {
        conversationsMap.set(convKey, {
          id: postulation.id_conversation,
          id_utilisateur: otherUser.id_utilisateur,
          nom: otherUser.nom,
          prenom: otherUser.prenom,
          id_offre: postulation.id_offre,
          titre_offre: postulation.offre?.titre || null,
          dernierMessage: postulation.contenu,
          dateMessage: postulation.date_envoi,
          nonLu: 0,
          messages: []
        });
      }
    }

    // 3. Récupérer tous les messages normaux
    const allMessages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: userId },
          { destinataire_id: userId }
        ]
      },
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
      ],
      order: [['date_envoi', 'DESC']]
    });

    // 4. Ajouter les messages aux conversations existantes ou créer de nouvelles conversations
    for (const message of allMessages) {
      const otherUser = message.expediteur_id === userId
        ? message.destinataire
        : message.expediteur;

      // Chercher d'abord par offre si disponible
      let convKey = message.id_offre 
        ? `${otherUser.id_utilisateur}_${message.id_offre}`
        : null;

      // Si pas de clé trouvée, chercher une conversation existante avec cet utilisateur
      if (!convKey || !conversationsMap.has(convKey)) {
        const existingConvKey = Array.from(conversationsMap.keys()).find(key => {
          const [existingUserId] = key.split('_');
          return existingUserId === String(otherUser.id_utilisateur);
        });
        convKey = existingConvKey || `${otherUser.id_utilisateur}_no_offer`;
      }

      if (!conversationsMap.has(convKey)) {
        conversationsMap.set(convKey, {
          id: message.id_conversation,
          id_utilisateur: otherUser.id_utilisateur,
          nom: otherUser.nom,
          prenom: otherUser.prenom,
          id_offre: message.id_offre,
          titre_offre: message.offre?.titre || null,
          dernierMessage: message.contenu,
          dateMessage: message.date_envoi,
          nonLu: 0,
          messages: []
        });
      }

      const conv = conversationsMap.get(convKey);
      
      // Mettre à jour les informations de la conversation si nécessaire
      if (new Date(message.date_envoi) > new Date(conv.dateMessage)) {
        conv.dernierMessage = message.contenu;
        conv.dateMessage = message.date_envoi;
      }

      // Mettre à jour les informations de l'offre si disponibles
      if (message.offre && !conv.titre_offre) {
        conv.titre_offre = message.offre.titre;
        conv.id_offre = message.id_offre;
      }
    }

    // 5. Calculer les messages non lus
    const conversations = await Promise.all(
      Array.from(conversationsMap.values()).map(async conv => {
        const unreadCount = await Message.count({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  { id_conversation: conv.id },
                  {
                    expediteur_id: conv.id_utilisateur,
                    destinataire_id: userId,
                    id_offre: conv.id_offre
                  }
                ]
              },
              {
                destinataire_id: userId,
                est_lu: false
              }
            ]
          }
        });

        return {
          ...conv,
          nonLu: unreadCount
        };
      })
    );

    // 6. Trier les conversations par date du dernier message
    conversations.sort((a, b) => new Date(b.dateMessage) - new Date(a.dateMessage));

    res.json(conversations);
  } catch (error) {
    console.error("❌ Erreur getConversations :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des conversations." });
  }
};

// Récupérer tous les messages pour une conversation spécifique
const getMessagesByConversation = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id_conversation } = req.params;

    // Récupérer un message de la conversation pour obtenir les informations nécessaires
    const conversationInfo = await Message.findOne({
      where: { id_conversation },
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

    if (!conversationInfo) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    if (conversationInfo.expediteur_id !== id_utilisateur && conversationInfo.destinataire_id !== id_utilisateur) {
      return res.status(403).json({ message: 'Accès non autorisé à cette conversation' });
    }

    const otherUserId = conversationInfo.expediteur_id === id_utilisateur
      ? conversationInfo.destinataire_id
      : conversationInfo.expediteur_id;

    // Récupérer tous les messages entre ces deux utilisateurs pour cette offre
    const messages = await Message.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                expediteur_id: id_utilisateur,
                destinataire_id: otherUserId
              },
              {
                expediteur_id: otherUserId,
                destinataire_id: id_utilisateur
              }
            ]
          },
          {
            id_offre: conversationInfo.id_offre
          }
        ]
      },
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
      ],
      order: [['date_envoi', 'ASC']]
    });

    // Marquer les messages comme lus
    const unreadMessages = messages.filter(
      msg => msg.destinataire_id === id_utilisateur && !msg.est_lu
    );

    if (unreadMessages.length > 0) {
      await Message.update(
        { 
          est_lu: true,
          date_lecture: new Date()
        },
        {
          where: {
            id_message: {
              [Op.in]: unreadMessages.map(msg => msg.id_message)
            }
          }
        }
      );
    }

    // Transformer les messages pour le frontend
    const transformedMessages = messages.map(msg => ({
      id_message: msg.id_message,
      contenu: msg.contenu,
      date_envoi: msg.date_envoi,
      expediteur_id: msg.expediteur_id,
      destinataire_id: msg.destinataire_id,
      est_lu: msg.est_lu,
      type_message: msg.type_message,
      id_conversation: msg.id_conversation,
      expediteur: {
        id_utilisateur: msg.expediteur.id_utilisateur,
        nom: msg.expediteur.nom,
        prenom: msg.expediteur.prenom
      },
      destinataire: {
        id_utilisateur: msg.destinataire.id_utilisateur,
        nom: msg.destinataire.nom,
        prenom: msg.destinataire.prenom
      },
      offre: msg.offre ? {
        id_offre: msg.offre.id_offre,
        titre: msg.offre.titre
      } : null
    }));

    res.json(transformedMessages);
  } catch (error) {
    console.error('❌ Erreur dans getMessagesByConversation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Marquer un message comme lu
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }

    message.est_lu = true;
    message.date_lecture = new Date();
    await message.save();

    res.json({ message: 'Message marqué comme lu.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du message.' });
  }
};

// Supprimer un message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Message.destroy({ where: { id_message: id } });
    if (deleted === 0) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }

    res.json({ message: 'Message supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message.' });
  }
};

const getMessagesByUserAndOffre = async (req, res) => {
  try {
    const { id_utilisateur, id_offre } = req.params;
    const monId = req.user.id_utilisateur;

    const messages = await Message.findAll({
      where: {
        id_offre,
        [Op.or]: [
          { expediteur_id: monId, destinataire_id: id_utilisateur },
          { expediteur_id: id_utilisateur, destinataire_id: monId }
        ]
      },
      include: [
        { model: User, as: 'expediteur', attributes: ['id_utilisateur', 'nom', 'prenom'] },
        { model: User, as: 'destinataire', attributes: ['id_utilisateur', 'nom', 'prenom'] }
      ],
      order: [['date_envoi', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error("❌ Erreur getMessagesByUserAndOffre :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMessagesByUser = async (req, res) => {
  try {
    const { id_utilisateur } = req.params;
    const monId = req.user.id_utilisateur;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: monId, destinataire_id: id_utilisateur },
          { expediteur_id: id_utilisateur, destinataire_id: monId }
        ]
      },
      include: [
        { model: User, as: 'expediteur', attributes: ['id_utilisateur', 'nom', 'prenom'] },
        { model: User, as: 'destinataire', attributes: ['id_utilisateur', 'nom', 'prenom'] },
        { model: Offre, as: 'offre', attributes: ['id_offre', 'titre'] }
      ],
      order: [['date_envoi', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error("❌ Erreur getMessagesByUser :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createMessage,
  getConversations,
  getMessagesByConversation,
  markAsRead,
  deleteMessage,
  getMessagesByUserAndOffre,
  getMessagesByUser
};
