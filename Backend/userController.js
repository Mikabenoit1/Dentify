const Utilisateur = require('../models/User'); // Importation du modèle Utilisateur
const bcrypt = require('bcryptjs'); // Pour chiffrer les mots de passe
const jwt = require('jsonwebtoken'); // Pour gérer les tokens JWT
const { sequelize } = require('../config/db'); // Connexion à MySQL

// Inscription d'un utilisateur
const registerUser = async (req, res) => {
    try {
        console.log("📌 Requête reçue :", req.body);

        const { nom, prenom, courriel, mot_de_passe, type_utilisateur, adresse, ville, province, code_postal } = req.body;

        // Vérification des champs obligatoires
        if (!nom || !prenom || !courriel || !mot_de_passe || !type_utilisateur || !adresse || !ville || !province || !code_postal) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        console.log("🔍 Vérification du courriel...");
        let user = await Utilisateur.findOne({ where: { courriel } });
        if (user) {
            return res.status(400).json({ message: "Courriel déjà utilisé" });
        }

        console.log("🔑 Hachage du mot de passe...");
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        console.log("✅ Création de l'utilisateur...");
        const newUser = await Utilisateur.create({
            nom,
            prenom,
            courriel,
            mot_de_passe: hashedPassword,
            type_utilisateur,
            adresse,
            ville,
            province,
            code_postal
        });

        res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Connexion d'un utilisateur
const loginUser = async (req, res) => {
    try {
        const { courriel, mot_de_passe } = req.body;
        const user = await Utilisateur.findOne({ where: { courriel } });

        if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        console.log("🔑 Génération du token...");
        const token = jwt.sign({ id_utilisateur: user.id_utilisateur }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.json({ token });

    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ message: error.message });
    }
};

// Récupération du profil utilisateur (protégé par JWT)
const getProfile = async (req, res) => {
    try {
        const user = await Utilisateur.findByPk(req.user.id_utilisateur, {
            attributes: { exclude: ["mot_de_passe"] }
        });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json(user);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
        res.status(500).json({ message: error.message });
    }
};

// 🔥 EXPORTATION DES FONCTIONS
module.exports = { registerUser, loginUser, getProfile };

