const jwt = require('jsonwebtoken') // Pour gérer les tokens JWT

// Middleware pour protéger les routes 
const protect = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) return res.status(401).json({ message: 'Accès refusé' })
    
    try {
        // Vérifier le token et ajouter l'utilisateur à la requête
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' })
    }
}

module.exports = protect