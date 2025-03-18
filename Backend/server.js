const express = require('express')
const dotenv = require('dotenv')
const { sequelize, connectDB } = require('./src/config/db')

dotenv.config()

const app = express()
app.use(express.json())

// Charger les routes
app.use('/api/users', require('./src/routes/userRoutes'))

// Route de test pour vérifier si le serveur tourne sans MySQL
app.get('/test', (req, res) => {
  res.send('✅ Serveur opérationnel même sans MySQL')
})

// Démarrer le serveur normalement
const PORT = process.env.PORT || 4000
app.listen(PORT, async () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)

  // Tenter la connexion à MySQL mais ne pas arrêter le serveur en cas d'échec
  await connectDB()
})


