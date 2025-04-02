const User = require('../models/User');
const CliniqueDentaire = require('../models/CliniqueDentaire');
const ProfessionnelDentaire = require('../models/ProfessionnelDentaire');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ INSCRIPTION
const registerUser = async (req, res) => {
  try {
    const { type_utilisateur, courriel, mot_de_passe } = req.body;

    if (!type_utilisateur || !courriel || !mot_de_passe) {
      return res.status(400).json({ message: "Type utilisateur, courriel et mot de passe sont requis" });
    }

    const existing = await User.findOne({ where: { courriel } });
    if (existing) {
      return res.status(400).json({ message: "Courriel déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    let newUser;

    if (type_utilisateur === 'clinique') {
      const { nom_clinique } = req.body;
      if (!nom_clinique) return res.status(400).json({ message: "Nom de la clinique requis" });

      newUser = await User.create({
        nom: nom_clinique,
        prenom: '',
        courriel,
        mot_de_passe: hashedPassword,
        type_utilisateur,
        adresse: '',
        ville: '',
        province: '',
        code_postal: ''
      });

      await CliniqueDentaire.create({
        id_utilisateur: newUser.id_utilisateur,
        nom_clinique,
        numero_entreprise: ''
      });

    } else if (type_utilisateur === 'professionnel') {
      const { nom, prenom } = req.body;
      if (!nom || !prenom) return res.status(400).json({ message: "Nom et prénom requis" });

      newUser = await User.create({
        nom,
        prenom,
        courriel,
        mot_de_passe: hashedPassword,
        type_utilisateur,
        adresse: '',
        ville: '',
        province: '',
        code_postal: ''
      });

      await ProfessionnelDentaire.create({
        id_utilisateur: newUser.id_utilisateur,
        numero_permis: '',
        type_profession: ''
      });

    } else {
      return res.status(400).json({ message: "Type utilisateur invalide" });
    }

    res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });

  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ MISE À JOUR DU PROFIL
const updateProfile = async (req, res) => {
  try {
    const id = req.user.id_utilisateur;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const {
      nom, prenom, adresse, ville, province, code_postal,
      numero_permis, type_profession, annees_experience,
      tarif_horaire, rayon_deplacement_km, disponibilite_immediate,
      site_web,
      nom_clinique, numero_entreprise, adresse_complete,
      latitude, longitude, horaire_ouverture,
      logiciels_utilises, type_dossier, type_radiographie
    } = req.body;

    user.nom = nom ?? user.nom;
    user.prenom = prenom ?? user.prenom;
    user.adresse = adresse ?? user.adresse;
    user.ville = ville ?? user.ville;
    user.province = province ?? user.province;
    user.code_postal = code_postal ?? user.code_postal;
    user.photo_profil = req.body.photo_profil ?? user.photo_profil;
    user.accepte_notifications = req.body.accepte_notifications ?? user.accepte_notifications;
    await user.save();

    if (user.type_utilisateur === 'professionnel') {
      const pro = await ProfessionnelDentaire.findOne({ where: { id_utilisateur: id } });
      if (pro) {
        pro.numero_permis = numero_permis ?? pro.numero_permis;
        pro.type_profession = type_profession ?? pro.type_profession;
        pro.annees_experience = annees_experience ?? pro.annees_experience;
        pro.tarif_horaire = tarif_horaire ?? pro.tarif_horaire;
        pro.rayon_deplacement_km = rayon_deplacement_km ?? pro.rayon_deplacement_km;
        pro.disponibilite_immediate = disponibilite_immediate ?? pro.disponibilite_immediate;
        pro.site_web = site_web ?? pro.site_web;
        await pro.save();
      }
    } else if (user.type_utilisateur === 'clinique') {
      const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: id } });
      if (clinique) {
        clinique.nom_clinique = nom_clinique ?? clinique.nom_clinique;
        clinique.numero_entreprise = numero_entreprise ?? clinique.numero_entreprise;
        clinique.adresse_complete = adresse_complete ?? clinique.adresse_complete;
        clinique.latitude = latitude ?? clinique.latitude;
        clinique.longitude = longitude ?? clinique.longitude;
        clinique.horaire_ouverture = horaire_ouverture ?? clinique.horaire_ouverture;
        clinique.site_web = site_web ?? clinique.site_web;
        clinique.logiciels_utilises = logiciels_utilises ?? clinique.logiciels_utilises;
        clinique.type_dossier = type_dossier ?? clinique.type_dossier;
        clinique.type_radiographie = type_radiographie ?? clinique.type_radiographie;
        await clinique.save();
      }
    }

    res.json({ message: "✅ Profil mis à jour avec succès" });

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ CONNEXION
const loginUser = async (req, res) => {
  try {
    const { courriel, mot_de_passe } = req.body;
    const user = await User.findOne({ where: { courriel } });

    if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id_utilisateur: user.id_utilisateur },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token });

  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ PROFIL UTILISATEUR
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_utilisateur, {
      attributes: { exclude: ["mot_de_passe"] }
    });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const pro = await ProfessionnelDentaire.findOne({ where: { id_utilisateur: user.id_utilisateur } });
    const clinique = await CliniqueDentaire.findOne({ where: { id_utilisateur: user.id_utilisateur } });

    let profil_complet = false;

    if (user.type_utilisateur === 'professionnel') {
      profil_complet = pro &&
        pro.numero_permis &&
        pro.type_profession &&
        user.nom &&
        user.prenom &&
        user.adresse &&
        user.ville &&
        user.code_postal;
    } else if (user.type_utilisateur === 'clinique') {
      profil_complet = clinique &&
        clinique.nom_clinique &&
        clinique.numero_entreprise &&
        clinique.adresse_complete &&
        user.nom &&
        user.adresse &&
        user.ville &&
        user.code_postal;
    }
    
    profil_complet = !!profil_complet;
    res.json({ ...user.toJSON(), profil_complet });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};
