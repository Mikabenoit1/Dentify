const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,  // Définit le port par défaut si non précisé
    logging: false,  // Désactive les logs SQL pour plus de clarté
    dialectOptions: process.env.DB_SOCKET 
        ? { socketPath: process.env.DB_SOCKET }  // Utilisation d'un socket si défini
        : {} // Sinon, connexion normale TCP/IP
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion MySQL réussie !');

        await sequelize.query('DROP TABLE IF EXISTS Utilisateurs'); // Supprime la table temporaire
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');


        // 🔄 Synchroniser la base de données avec les modèles
        await sequelize.sync({ alter: true });
        console.log('✅ Base de données synchronisée avec Sequelize');

    } catch (error) {
        console.error('❌ Erreur de connexion à MySQL :', error);
    }
};

module.exports = { sequelize, connectDB };
