const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CliniqueDentaire = sequelize.define('CliniqueDentaire', {
  id_clinique: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_clinique: { type: DataTypes.STRING(100), allowNull: false },
  numero_entreprise: { type: DataTypes.STRING(10), allowNull: false },
  adresse_complete: { type: DataTypes.STRING(255) },
  latitude: { type: DataTypes.DECIMAL(10, 6) },
  longitude: { type: DataTypes.DECIMAL(10, 6) },
  horaire_ouverture: { type: DataTypes.STRING(500) },
  site_web: { type: DataTypes.STRING(100) },
  logiciels_utilises: { type: DataTypes.STRING(255) },
  type_dossier: { type: DataTypes.STRING(20) },
  type_radiographie: { type: DataTypes.STRING(30) },
  compte_verifie: { type: DataTypes.CHAR(1), defaultValue: 'N' },
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
  tableName: 'CliniqueDentaire',
  timestamps: false
});

module.exports = CliniqueDentaire;

