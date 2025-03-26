const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CliniqueDentaire = sequelize.define('CliniqueDentaire', {
  id_clinique: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom_clinique: { type: DataTypes.STRING, allowNull: false },
  adresse: { type: DataTypes.STRING, allowNull: false },
  ville: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING, allowNull: false },
  code_postal: { type: DataTypes.STRING, allowNull: false },
  telephone: { type: DataTypes.STRING }
}, {
  tableName: 'CliniqueDentaire',
  timestamps: false
});

module.exports = CliniqueDentaire;