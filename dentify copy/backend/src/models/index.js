const { sequelize } = require('../config/db');

const User = require('./User');
const Offre = require('./Offre');
const Candidature = require('./Candidature');
const CliniqueDentaire = require('./CliniqueDentaire');
const ProfessionnelDentaire = require('./ProfessionnelDentaire');

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

module.exports = {
  sequelize,
  User,
  Offre,
  Candidature,
  CliniqueDentaire,
  ProfessionnelDentaire
};
