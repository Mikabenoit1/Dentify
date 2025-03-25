const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, connectDB } = require('./src/config/db');

// Initialisation
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Connexion à la base de données
(async () => {
  try {
    await connectDB();
    console.log('✅ Base de données connectée');
  } catch (dbError) {
    console.error('❌ Erreur DB:', dbError.message);
  }
})();

// Routes
app.use('/api/users', require('./src/routes/userRoutes'));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Serveur opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('🔥 Erreur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

// Gestion propre des arrêts
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});