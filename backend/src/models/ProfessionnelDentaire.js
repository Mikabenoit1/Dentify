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
  description: { type: DataTypes.TEXT },
  telephone: { type: DataTypes.STRING(20) },
  vehicule: { type: DataTypes.BOOLEAN, defaultValue: false },
  regions: { type: DataTypes.JSON },
  date_debut_dispo: { type: DataTypes.DATE },
  date_fin_dispo: { type: DataTypes.DATE },
  jours_disponibles: { type: DataTypes.JSON },
  competences: { type: DataTypes.JSON },
  langues: { type: DataTypes.JSON },
  specialites: { type: DataTypes.JSON },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ProfessionnelDentaire',
  timestamps: false
});

module.exports = ProfessionnelDentaire;
