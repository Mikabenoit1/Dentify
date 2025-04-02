const { sequelize } = require('../config/db');

const User = require('./User');
const Offre = require('./Offre');
const Candidature = require('./Candidature');
const CliniqueDentaire = require('./CliniqueDentaire');
const ProfessionnelDentaire = require('./ProfessionnelDentaire');
const Message = require('./Message');

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
  foreignKey: 'id_expediteur',
  as: 'messages_envoyes',
  onDelete: 'CASCADE'
});
Message.belongsTo(User, {
  foreignKey: 'id_expediteur',
  as: 'expediteur'
});

// 🔗 Utilisateur → Messages reçus
User.hasMany(Message, {
  foreignKey: 'id_destinataire',
  as: 'messages_recus',
  onDelete: 'CASCADE'
});
Message.belongsTo(User, {
  foreignKey: 'id_destinataire',
  as: 'destinataire'
});


module.exports = {
  sequelize,
  User,
  Offre,
  Candidature,
  CliniqueDentaire,
  ProfessionnelDentaire,
  Message
};
