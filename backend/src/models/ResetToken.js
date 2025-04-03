const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ResetToken = sequelize.define('ResetToken', {
  id_token: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiration: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'ResetToken',
  timestamps: false
});

module.exports = ResetToken;
