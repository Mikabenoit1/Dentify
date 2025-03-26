const Utilisateur = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fonction d'inscription
const registerUser = async (req, res) => {
    console.log('\n=== NOUVELLE INSCRIPTION ===');
    try {
        console.log("📌 Requête reçue :", req.body);

        // Champs obligatoires
        const { nom, courriel, mot_de_passe } = req.body;
        if (!nom || !courriel || !mot_de_passe) {
            console.log("❌ Champs manquants :", {
                nom: !!nom, 
                courriel: !!courriel, 
                mot_de_passe: !!mot_de_passe
            });
            return res.status(400).json({ message: "Nom, courriel et mot de passe sont obligatoires" });
        }

        // Champs optionnels avec valeurs par défaut
        const { 
            prenom = '', 
            type_utilisateur = 'professionnel',
            adresse = '', 
            ville = '', 
            province = '', 
            code_postal = '' 
        } = req.body;

        console.log("🔍 Vérification de l'email...");
        const userExists = await Utilisateur.findOne({ where: { courriel } });
        if (userExists) {
            console.log(`❌ Email ${courriel} déjà utilisé`);
            return res.status(400).json({ message: "Courriel déjà utilisé" });
        }

        console.log("🔑 Hachage du mot de passe...");
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        console.log("🛠️ Création de l'utilisateur...");
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

        console.log("✅ Utilisateur créé :", {
            id: newUser.id_utilisateur,
            email: newUser.courriel
        });

        res.status(201).json({ 
            message: "Inscription réussie",
            user: {
                id: newUser.id_utilisateur,
                email: newUser.courriel
            }
        });

    } catch (error) {
        console.error("❌ Erreur :", {
            message: error.message,
            validationErrors: error.errors?.map(e => e.message)
        });
        res.status(500).json({ 
            message: "Erreur lors de l'inscription",
            ...(process.env.NODE_ENV === 'development' && { 
                details: error.message 
            })
        });
    }
};

// Fonction de connexion
const loginUser = async (req, res) => {
    try {
        const { courriel, mot_de_passe } = req.body;
        const user = await Utilisateur.findOne({ where: { courriel } });

        if (!user) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const token = jwt.sign(
            { id_utilisateur: user.id_utilisateur },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ token });

    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Fonction de récupération de profil
const getProfile = async (req, res) => {
    try {
        const user = await Utilisateur.findByPk(req.user.id_utilisateur, {
            attributes: { exclude: ['mot_de_passe'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(user);

    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Export des fonctions
module.exports = {
    registerUser,
    loginUser,
    getProfile
};