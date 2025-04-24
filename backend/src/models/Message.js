const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
  id_message: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_conversation: { 
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  expediteur_id: { type: DataTypes.INTEGER, allowNull: false },
  destinataire_id: { type: DataTypes.INTEGER, allowNull: false },
  contenu: { type: DataTypes.TEXT, allowNull: false },
  date_envoi: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // 🔁 correspond au champ MySQL
  date_lecture: { type: DataTypes.DATE, allowNull: true }, // 📅 lecture optionnelle
  est_lu: { type: DataTypes.BOOLEAN, defaultValue: false },
  est_modifie: { type: DataTypes.BOOLEAN, defaultValue: false },
  type_message: { type: DataTypes.STRING, defaultValue: 'normal' },
  fichier_joint: { type: DataTypes.STRING, allowNull: true },
  id_offre: { type: DataTypes.INTEGER },
  id_entretien: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Entretien',
      key: 'id_entretien'
    },
    onDelete: 'SET NULL'
  }
  
}, {
  tableName: 'Message',
  timestamps: false,
  indexes: [
    {
      name: 'idx_conversation',
      fields: ['id_conversation']
    }
  ]
});

module.exports = Message;
