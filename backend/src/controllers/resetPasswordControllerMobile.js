const { User, ResetToken } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// POST /api/reset/request-code
exports.envoyerCodeReinitialisation = async (req, res) => {
    const { courriel } = req.body;
  
    try {
      const utilisateur = await User.findOne({ where: { courriel } });
      if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      // Supprimer les anciens codes
      await ResetToken.destroy({ where: { id_utilisateur: utilisateur.id_utilisateur } });
  
      // Générer un code à 6 chiffres
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiration = new Date(Date.now() + 15 * 60 * 1000); // expire dans 15 min
  
      await ResetToken.create({
        id_utilisateur: utilisateur.id_utilisateur,
        token: code, // pour stocker le code
        expiration
      });
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: utilisateur.courriel,
        subject: 'Code de réinitialisation - Dentify',
        html: `<p>Bonjour ${utilisateur.prenom || "utilisateur"},</p>
               <p>Voici votre code de réinitialisation :</p>
               <h2>${code}</h2>
               <p>Ce code expirera dans 15 minutes.</p>`
      });
  
      res.status(200).json({ message: "Code envoyé par courriel." });
  
    } catch (error) {
      console.error("Erreur envoi code :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  

// POST /api/reset/verify-code
exports.verifierCode = async (req, res) => {
    const { courriel, code } = req.body;
  
    try {
      const utilisateur = await User.findOne({ where: { courriel } });
      if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      const reset = await ResetToken.findOne({ 
        where: { 
          id_utilisateur: utilisateur.id_utilisateur,
          token: code 
        }
      });
  
      if (!reset || reset.expiration < new Date()) {
        return res.status(400).json({ message: "Code invalide ou expiré." });
      }
  
      res.status(200).json({ message: "Code valide." });
  
    } catch (error) {
      console.error("Erreur vérification code :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

  // POST /api/reset/confirm-code
exports.confirmerReinitialisationAvecCode = async (req, res) => {
    const { courriel, code, nouveauMotDePasse } = req.body;
  
    try {
      const utilisateur = await User.findOne({ where: { courriel } });
      if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      const reset = await ResetToken.findOne({ 
        where: { 
          id_utilisateur: utilisateur.id_utilisateur,
          token: code
        }
      });
  
      if (!reset || reset.expiration < new Date()) {
        return res.status(400).json({ message: "Code invalide ou expiré." });
      }
  
      const motDePasseHashe = await bcrypt.hash(nouveauMotDePasse, 10);
      utilisateur.mot_de_passe = motDePasseHashe;
      await utilisateur.save();
  
      await reset.destroy(); // suppression du code après usage
  
      res.status(200).json({ message: "Mot de passe mis à jour !" });
  
    } catch (error) {
      console.error("Erreur confirmation avec code :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
