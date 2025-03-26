const { sequelize } = require('../config/db');

const User = require('./User');
const Offre = require('./Offre');
const Candidature = require('./Candidature');
const CliniqueDentaire = require('./CliniqueDentaire');

module.exports = {
  sequelize,
  User,
  Offre,
  Candidature,
  CliniqueDentaire
};