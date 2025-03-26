const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, connectDB } = require('./src/config/db');

// ✅ Import des routes
const offreRoutes = require('./src/routes/offreRoutes');
const candidatureRoutes = require('./src/routes/candidatureRoutes'); 
const cliniqueRoutes = require('./src/routes/cliniqueRoutes');

// Initialisation
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour parser les formulaires

// CORS adapté pour Mobile + Web
app.use(cors({
  origin: [
    process.env.WEB_URL || 'http://localhost:5173', // Frontend web
    'http://localhost:19006', // React Native en local
    /\.yourdomain\.com$/, // Regex pour votre domaine en prod
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] // Toutes les méthodes nécessaires
}));

// Connexion DB
(async () => {
  try {
    await connectDB();
    console.log('✅ Base de données connectée');
    await sequelize.sync(); // Synchronisation des modèles
  } catch (dbError) {
    console.error('❌ Erreur DB:', dbError.message);
  }
})();

// ✅ Utilisation des routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/offres', offreRoutes);
app.use('/candidatures', candidatureRoutes); 
app.use('/api/cliniques', cliniqueRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    db: sequelize.authenticated ? 'connected' : 'disconnected'
  });
});

// Gestion des erreurs
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

app.use((err, req, res, next) => {
  console.error('🔥 Erreur:', err.message);
  res.status(500).json({ 
    error: 'Erreur interne',
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack })
  });
});

// Démarrage
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

// Gestion des arrêts
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});
