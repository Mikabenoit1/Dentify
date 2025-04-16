const { User, ResetToken } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// POST /api/reset/request
exports.demanderReinitialisation = async (req, res) => {
  const { courriel } = req.body;

  try {
    const utilisateur = await User.findOne({ where: { courriel } });
    if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Supprimer les anciens tokens
    await ResetToken.destroy({ where: { id_utilisateur: utilisateur.id_utilisateur } });

    // Générer un nouveau token
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await ResetToken.create({
      id_utilisateur: utilisateur.id_utilisateur,
      token,
      expiration
    });

    const lien = `http://localhost:5173/reinitialiser/${token}`;

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
      subject: 'Réinitialisation du mot de passe - Dentify',
      html: `<p>Bonjour ${utilisateur.prenom},</p>
             <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
             <a href="${lien}">${lien}</a>
             <p><strong>Ce lien expirera dans 15 minutes.</strong></p>`
    });

    res.status(200).json({ message: "Courriel de réinitialisation envoyé." });
  } catch (error) {
    console.error("Erreur reset request :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST /api/reset/confirm
exports.confirmerReinitialisation = async (req, res) => {
  const { token, nouveauMotDePasse } = req.body;

  try {
    const reset = await ResetToken.findOne({ where: { token } });
    if (!reset || reset.expiration < new Date()) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    const utilisateur = await User.findByPk(reset.id_utilisateur);
    if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });

    const motDePasseHashe = await bcrypt.hash(nouveauMotDePasse, 10);
    utilisateur.mot_de_passe = motDePasseHashe;
    await utilisateur.save();

    await reset.destroy(); // supprimer le token après usage

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur reset confirm :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
