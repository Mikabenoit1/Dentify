const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  console.log("🔐 Protection middleware - Début");
  console.log("En-têtes de la requête:", req.headers);

  const authHeader = req.header('Authorization');
  console.log("En-tête Authorization:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn("❌ Pas de token Bearer");
    return res.status(401).json({ message: 'Accès refusé' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Token extrait:", token ? "Présent" : "Absent");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 Token décodé:", decoded);

    // Aller chercher le user complet en DB
    const user = await User.findByPk(decoded.id_utilisateur);

    if (!user) {
      console.warn("❌ Utilisateur introuvable");
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    console.log("👤 Utilisateur trouvé:", {
      id: user.id_utilisateur,
      type: user.type_utilisateur
    });

    // On attache tout l'objet user requis aux routes protégées
    req.user = {
      id_utilisateur: user.id_utilisateur,
      type_utilisateur: user.type_utilisateur
    };

    next();
  } catch (error) {
    console.error("❌ Erreur de vérification du token:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }

    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = protect;