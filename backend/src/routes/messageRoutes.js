const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const protect = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

// Envoyer un message
router.post('/', protect, async (req, res) => {
    try {
        const { id_destinataire, contenu, type_message, id_offre } = req.body;

        const nouveauMessage = await Message.create({
            id_expediteur: req.user.id_utilisateur,
            id_destinataire,
            contenu,
            type_message: type_message || 'normal',
            id_offre
        });

        res.status(201).json(nouveauMessage);
    } catch (error) {
        console.error('Erreur lors de l’envoi du message :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}); 

// Obtenir tous les messages avec un utilisateur donné 
router.get('/:id_utilisateur', protect, async (req, res) => {
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { id_expediteur: req.user.id_utilisateur, id_destinataire: req.params.id_utilisateur },
            { id_expediteur: req.params.id_utilisateur, id_destinataire: req.user.id_utilisateur }
          ]
        },
        order: [['timestamp', 'ASC']]
      });
  
      res.json(messages);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Modifier un message
  router.put('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message || message.id_expediteur !== req.user.id_utilisateur) {
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

// Supprimer un message
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message || message.id_expediteur !== req.user.id_utilisateur) {
            return res.status(403).json({ message: 'Non autorisé à supprimer ce message' });
        }

        await message.destroy();
        res.json({ message: 'Message supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du message :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Voir la liste des conversations avec qui j'ai discuté 
router.get('/conversations', protect, async (req, res) => {
  try {
    const id = req.user.id_utilisateur;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { id_expediteur: id },
          { id_destinataire: id }
        ]
      },
      attributes: ['id_expediteur', 'id_destinataire'],
      raw: true
    });

    const interlocuteurs = new Set();
    messages.forEach(message => {
      if (msg.id_expediteur !== id) interlocuteurs.add(msg.id_expediteur);
      if (msg.id_destinataire !== id) interlocuteurs.add(msg.id_destinataire);
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


module.exports = router;