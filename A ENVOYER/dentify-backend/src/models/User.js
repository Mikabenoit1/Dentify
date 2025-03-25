const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Définition du modèle utilisateur

const User = sequelize.define('Utilisateur', {  // ⬅️ Utilisation du bon nom de table
    id_utilisateur: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: true },
    prenom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: true },
    ville: { type: DataTypes.STRING, allowNull: true },
    province: { type: DataTypes.STRING, allowNull: true },
    code_postal: { type: DataTypes.STRING, allowNull: true },
    courriel: { type: DataTypes.STRING, allowNull: false, unique: true },
    mot_de_passe: { type: DataTypes.STRING, allowNull: false },
    type_utilisateur: { type: DataTypes.STRING, allowNull: false },
    photo_profil: { type: DataTypes.STRING },
    derniere_connexion: { type: DataTypes.DATE },
    compte_verifie: { type: DataTypes.CHAR(1), defaultValue: 'N' },
    date_verification: { type: DataTypes.DATE },
    accepte_notifications: { type: DataTypes.CHAR(1), defaultValue: 'Y' }
}, {
    tableName: 'Utilisateur',  // ⬅️ Force l'utilisation du bon nom de table
    timestamps: false          // ⬅️ Désactive les colonnes createdAt et updatedAt
});

module.exports = User;