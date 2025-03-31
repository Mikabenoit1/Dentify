const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Candidature = sequelize.define('Candidature', {
  id_candidature: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_offre: { type: DataTypes.INTEGER, allowNull: false },
  id_professionnel: { type: DataTypes.INTEGER, allowNull: false },
  id_administrateur_verificateur: { type: DataTypes.INTEGER },
  date_candidature: { type: DataTypes.DATE, allowNull: false },
  message_personnalise: { type: DataTypes.STRING },
  statut: { type: DataTypes.STRING, defaultValue: 'en_attente' },
  date_reponse: { type: DataTypes.DATE },
  message_reponse: { type: DataTypes.STRING },
  est_confirmee: { type: DataTypes.CHAR(1), defaultValue: 'N' }
}, {
  tableName: 'Candidature',
  timestamps: false
});

module.exports = Candidature;
