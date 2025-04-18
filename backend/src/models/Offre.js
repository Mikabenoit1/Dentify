const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Offre = sequelize.define('Offre', {
  id_offre: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_clinique: { type: DataTypes.INTEGER, allowNull: false },
  titre: { type: DataTypes.STRING, allowNull: false },
  descript: { type: DataTypes.STRING, allowNull: false },
  type_professionnel: { type: DataTypes.STRING, allowNull: false },
  date_publication: { type: DataTypes.DATE, allowNull: false },
  date_mission: { type: DataTypes.DATE, allowNull: false },
  date_debut: { type: DataTypes.DATEONLY, allowNull: false },
  date_fin: { type: DataTypes.DATEONLY, allowNull: false },
  heure_debut: { type: DataTypes.DATE },
  heure_fin: { type: DataTypes.DATE },
  duree_heures: { type: DataTypes.FLOAT },
  remuneration: { type: DataTypes.FLOAT, allowNull: false },
  est_urgent: { type: DataTypes.CHAR(1), defaultValue: 'N' },
  statut: { type: DataTypes.STRING, defaultValue: 'active' },
  competences_requises: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  adresse_complete: { type: DataTypes.STRING },
  date_modification: { type: DataTypes.DATE }
}, {
  tableName: 'Offre',
  timestamps: false
});

module.exports = Offre;
