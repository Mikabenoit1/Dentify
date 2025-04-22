// controllers/messageController.js
const { Message, Utilisateur, Offre } = require('../models');
const { Op } = require('sequelize');

// Créer un nouveau message
exports.createMessage = async (req, res) => {

  
  try {
    console.log("📨 createMessage appelé");
    console.log("🧾 Corps reçu :", req.body);
    const {
      expediteur_id,
      destinataire_id,
      contenu,
      offre_id,
      meeting_id,        // ✅ corriger ici
      fichier_joint
    } = req.body;

    const message = await Message.create({
      expediteur_id,
      destinataire_id,
      contenu,
      id_offre: offre_id,        // ✅ mapping correct vers la colonne SQL
      id_entretien: meeting_id || null, // ✅ nom correct pour la colonne DB
      fichier_joint: fichier_joint || null,
      date_envoi: new Date(),
      est_lu: false
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('❌ Erreur lors de la création du message :', error);
    res.status(500).json({ error: 'Erreur lors de la création du message.' });
  }
};


exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id_utilisateur;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_id: userId },
          { destinataire_id: userId }
        ]
      },
      order: [['date_envoi', 'ASC']]
    });

    const grouped = {};

    messages.forEach(msg => {
      const key = `${msg.destinataire_id}-${msg.id_offre}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          offreId: msg.id_offre,
          candidatId: msg.expediteur_id === userId ? msg.destinataire_id : msg.expediteur_id,
          messages: [],
          lastMessage: '',
          lastMessageDate: ''
        };
      }

      grouped[key].messages.push(msg);

      if (!grouped[key].lastMessageDate || new Date(msg.date_envoi) > new Date(grouped[key].lastMessageDate)) {
        grouped[key].lastMessage = msg.contenu;
        grouped[key].lastMessageDate = msg.date_envoi;
      }
    });

    const result = Object.values(grouped);
    console.log("🧩 Conversations regroupées :", result);

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Erreur getConversations :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des conversations." });
  }
};

// Récupérer tous les messages pour une conversation spécifique
exports.getMessagesForConversation = async (req, res) => {
  try {
    const { id } = req.params; // id de l'offre ou de la conversation
    const userId = req.user.id_utilisateur;

    const messages = await Message.findAll({
      where: {
        offre_id: id,
        [Op.or]: [
          { expediteur_id: userId },
          { destinataire_id: userId }
        ]
      },
      include: [
        { model: Utilisateur, as: 'expediteur', attributes: ['id_utilisateur', 'nom', 'prenom'] }
      ],
      order: [['date_envoi', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
};

// Marquer un message comme lu
exports.markAsRead = async (req, res) => {
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
exports.deleteMessage = async (req, res) => {
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
