const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProfessionnelDentaire = sequelize.define('ProfessionnelDentaire', {
  id_professionnel: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero_permis: { type: DataTypes.STRING(10), allowNull: false },
  type_profession: { type: DataTypes.STRING(20), allowNull: false },
  annees_experience: { type: DataTypes.INTEGER },
  tarif_horaire: { type: DataTypes.DECIMAL(6, 2) },
  rayon_deplacement_km: { type: DataTypes.INTEGER },
  disponibilite_immediate: { type: DataTypes.CHAR(1), defaultValue: 'N' },
  site_web: { type: DataTypes.STRING(100) },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Utilisateur',
      key: 'id_utilisateur'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'ProfessionnelDentaire',
  timestamps: false
});

module.exports = ProfessionnelDentaire;
