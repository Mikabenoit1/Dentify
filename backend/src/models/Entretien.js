const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Entretien = sequelize.define('Entretien', {
  id_entretien: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_offre: { type: DataTypes.INTEGER, allowNull: false },
  id_clinique: { type: DataTypes.INTEGER, allowNull: false },
  id_professionnel: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  heure_debut: { type: DataTypes.TIME, allowNull: false },
  heure_fin: { type: DataTypes.TIME, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // 'video', 'telephone', 'en_personne'
  lien_visio: { type: DataTypes.STRING },
  statut: { type: DataTypes.STRING, defaultValue: 'prévu' }, // prévu, confirmé, annulé
  notes: { type: DataTypes.TEXT }
}, {
  tableName: 'Entretien',
  timestamps: false
});

module.exports = Entretien;