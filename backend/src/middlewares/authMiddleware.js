const jwt = require('jsonwebtoken');
const { User } = require('../models'); 


const protect = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Aller chercher le user complet en DB pour récupérer son type_utilisateur
    const user = await User.findByPk(decoded.id_utilisateur);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    //  On attache tout l'objet user requis aux routes protégées
    req.user = {
      id_utilisateur: user.id_utilisateur,
      type_utilisateur: user.type_utilisateur
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = protect;
