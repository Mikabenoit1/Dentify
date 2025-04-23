const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Message = require('./Message');


const User = require('./User'); 

const Conversation = sequelize.define('Conversation', {
  id_conversation: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  utilisateur1_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  utilisateur2_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_offre: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Conversation',
  timestamps: false, 
  indexes: [
    {
      unique: true,
      fields: ['utilisateur1_id', 'utilisateur2_id', 'id_offre']
    }
  ]
});


  

module.exports = Conversation;
