const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Offre = require('./Offre');

const Evaluation = sequelize.define('Evaluation', {
  id_evaluation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  evaluateur_id: { type: DataTypes.INTEGER, allowNull: false },
  evalue_id: { type: DataTypes.INTEGER, allowNull: false },
  id_offre: { type: DataTypes.INTEGER, allowNull: false },
  note: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  commentaire: { type: DataTypes.STRING(1000), allowNull: true },
  date_evaluation: { type: DataTypes.DATE, allowNull: false },
  est_approuve: { type: DataTypes.STRING(1), defaultValue: 'N' },
  date_approbation: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'Evaluation',
  timestamps: false
});

// Définir les relations
Evaluation.belongsTo(User, { foreignKey: 'evaluateur_id', as: 'evaluateur' });
Evaluation.belongsTo(User, { foreignKey: 'evalue_id', as: 'evalue' });
Evaluation.belongsTo(Offre, { foreignKey: 'id_offre' });

module.exports = Evaluation;
