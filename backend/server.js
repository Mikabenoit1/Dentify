const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, connectDB } = require('./src/config/db');

// 🔒 Charger les variables d'environnement
dotenv.config();

const app = express();

// 🧠 Middlewares
app.use(express.json());
app.use(require('cookie-parser')()); // ← pour les tokens envoyés via cookie si besoin
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
})); // Autoriser les requêtes du frontend (utile si backend = 4000, frontend = 5173)

// 📦 Routes
const userRoutes = require('./src/routes/userRoutes');
const offreRoutes = require('./src/routes/offreRoutes');
const candidatureRoutes = require('./src/routes/candidatureRoutes');
const cliniqueRoutes = require('./src/routes/cliniqueRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

// 🔗 Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/offres', offreRoutes);
app.use('/api/candidatures', candidatureRoutes);
app.use('/api/cliniques', cliniqueRoutes);
app.use('/api/messages', messageRoutes);

// ✅ Route de test
app.get('/test', (req, res) => {
  res.send('✅ Serveur opérationnel même sans MySQL');
});

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  await connectDB();
});

