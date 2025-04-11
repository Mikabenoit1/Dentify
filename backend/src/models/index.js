const { sequelize } = require('../config/db');

const User = require('./User');
const Offre = require('./Offre');
const Candidature = require('./Candidature');
const CliniqueDentaire = require('./CliniqueDentaire');
const ProfessionnelDentaire = require('./ProfessionnelDentaire');
const Message = require('./Message');
const ResetToken = require('./ResetToken');
const Notification = require('./Notification');
const Document = require('./Document')(sequelize, require('sequelize').DataTypes);

// 🔗 Utilisateur → CliniqueDentaire (1:1)
User.hasOne(CliniqueDentaire, {
  foreignKey: 'id_utilisateur',
  onDelete: 'CASCADE'
});
CliniqueDentaire.belongsTo(User, {
  foreignKey: 'id_utilisateur'
});

// 🔗 Utilisateur → ProfessionnelDentaire (1:1)
User.hasOne(ProfessionnelDentaire, {
  foreignKey: 'id_utilisateur',
  onDelete: 'CASCADE'
});
ProfessionnelDentaire.belongsTo(User, {
  foreignKey: 'id_utilisateur'
});

// 🔗 CliniqueDentaire → Offre (1:N)
CliniqueDentaire.hasMany(Offre, {
  foreignKey: 'id_clinique',
  onDelete: 'CASCADE'
});
Offre.belongsTo(CliniqueDentaire, {
  foreignKey: 'id_clinique'
});

// 🔗 Offre → Candidature (1:N)
Offre.hasMany(Candidature, {
  foreignKey: 'id_offre',
  onDelete: 'CASCADE'
});
Candidature.belongsTo(Offre, {
  foreignKey: 'id_offre'
});

// 🔗 ProfessionnelDentaire → Candidature (1:N)
ProfessionnelDentaire.hasMany(Candidature, {
  foreignKey: 'id_professionnel',
  onDelete: 'CASCADE'
});
Candidature.belongsTo(ProfessionnelDentaire, {
  foreignKey: 'id_professionnel'
});

// 🔗 Utilisateur → Messages envoyés
User.hasMany(Message, {
  foreignKey: 'expediteur_id',
  as: 'messages_envoyes',
  onDelete: 'CASCADE'
});
Message.belongsTo(User, {
  foreignKey: 'expediteur_id',
  as: 'expediteur'
});

// 🔗 Utilisateur → Messages reçus
User.hasMany(Message, {
  foreignKey: 'destinataire_id',
  as: 'messages_recus',
  onDelete: 'CASCADE'
});
Message.belongsTo(User, {
  foreignKey: 'destinataire_id',
  as: 'destinataire'
});

// 🔐 Utilisateur → ResetToken (1:N)
User.hasMany(ResetToken, {
  foreignKey: 'id_utilisateur',
  onDelete: 'CASCADE'
});
ResetToken.belongsTo(User, {
  foreignKey: 'id_utilisateur'
});

User.hasMany(Notification, {
  foreignKey: 'id_destinataire',
  onDelete: 'CASCADE'
});
Notification.belongsTo(User, {
  foreignKey: 'id_destinataire'
});

// 🔗 Utilisateur → Document (1:N)
User.hasMany(Document, {
  foreignKey: 'id_utilisateur',
  onDelete: 'CASCADE'
});
Document.belongsTo(User, {
  foreignKey: 'id_utilisateur'
});



module.exports = {
  sequelize,
  User,
  Offre,
  Candidature,
  CliniqueDentaire,
  ProfessionnelDentaire,
  Message,
  ResetToken,
  Notification,
  Document
};
