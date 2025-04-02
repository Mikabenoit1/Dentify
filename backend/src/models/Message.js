const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
    id_message: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_expediteur: { type: DataTypes.INTEGER, allowNull: false },
    id_destinataire: { type: DataTypes.INTEGER, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    est_lu: { type: DataTypes.BOOLEAN, defaultValue: false },
    est_modifie: { type: DataTypes.BOOLEAN, defaultValue: false },
    type_message: { type: DataTypes.STRING, defaultValue: 'normal' },
    id_offre: { type: DataTypes.INTEGER } // Optionnel, pour relier à une offre spécifique
  }, {
    tableName: 'Message',
    timestamps: false
  });

  module.exports = Message;

  