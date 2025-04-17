const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // adapte le chemin selon ton projet

const Notification = sequelize.define('Notification', {
  id_notification: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_destinataire: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type_notification: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  contenu: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  date_creation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  est_lue: {
    type: DataTypes.CHAR(1),
    defaultValue: 'N'
  },
  date_lecture: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lien_action: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'Notification',
  timestamps: false
});

module.exports = Notification;
