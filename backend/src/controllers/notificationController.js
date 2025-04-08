const { Notification } = require('../models');

// 📩 Créer une notification
const creerNotification = async ({ id_destinataire, type_notification, contenu, lien_action = null }) => {
  try {
    await Notification.create({
      id_destinataire,
      type_notification,
      contenu,
      date_creation: new Date(),
      est_lue: 'N',
      lien_action
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création de la notification :", error);
  }
};

// 📬 Récupérer les notifications d'un utilisateur avec pagination et tri
const getNotifications = async (req, res) => {
  try {
    const { id_utilisateur } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'date_creation';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    const total = await Notification.count({
      where: { id_destinataire: id_utilisateur }
    });

    const notifications = await Notification.findAll({
      where: { id_destinataire: id_utilisateur },
      order: [[sortBy, order]],
      limit,
      offset
    });

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      notifications
    });
  } catch (error) {
    console.error("❌ Erreur récupération notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Marquer une notification comme lue
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByPk(id);

    if (!notif) return res.status(404).json({ message: "Notification non trouvée" });

    notif.est_lue = 'Y';
    notif.date_lecture = new Date();
    await notif.save();

    res.json({ message: "Notification marquée comme lue" });
  } catch (error) {
    console.error("❌ Erreur update notification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  creerNotification,
  getNotifications,
  markAsRead
};
