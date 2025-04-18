const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CliniqueDentaire = sequelize.define('CliniqueDentaire', {
  id_clinique: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_clinique: { type: DataTypes.STRING(100), allowNull: false },
  numero_entreprise: { type: DataTypes.STRING(10), allowNull: true },
  adresse_complete: { type: DataTypes.STRING(255), allowNull: true },
  latitude: { type: DataTypes.DECIMAL(10, 6), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(10, 6), allowNull: true },
  horaires: { 
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: {
      lundi: { ouvert: true, debut: '09:00', fin: '17:00' },
      mardi: { ouvert: true, debut: '09:00', fin: '17:00' },
      mercredi: { ouvert: true, debut: '09:00', fin: '17:00' },
      jeudi: { ouvert: true, debut: '09:00', fin: '17:00' },
      vendredi: { ouvert: true, debut: '09:00', fin: '17:00' },
      samedi: { ouvert: false, debut: '09:00', fin: '17:00' },
      dimanche: { ouvert: false, debut: '09:00', fin: '17:00' }
    }
  },
  site_web: { type: DataTypes.STRING(100), allowNull: true },
  telephone: { type: DataTypes.STRING(20), allowNull: true },
  email: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  specialites: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  services: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  equipement: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  equipe: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  logo: { type: DataTypes.STRING(255), allowNull: true },
  photos: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  logiciels_utilises: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  type_dossier: { type: DataTypes.STRING(20), allowNull: true },
  type_radiographie: { type: DataTypes.STRING(30), allowNull: true },
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