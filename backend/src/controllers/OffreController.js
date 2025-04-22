const { Offre, CliniqueDentaire } = require('../models');
const { Op, literal } = require('sequelize');
const protect = require('../middlewares/authMiddleware');
const { get } = require('http');


const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // Rayon de la Terre en km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getFilteredOffres = async (req, res) => {
  try {
    const { id_professionnel, rayon_km, filtrer_par_type } = req.query;

    if (!id_professionnel) {
      return res.status(400).json({ error: 'ID professionnel requis' });
    }

    const professionnel = await require('../models').ProfessionnelDentaire.findByPk(id_professionnel);
    if (!professionnel) {
      return res.status(404).json({ error: 'Professionnel non trouvé' });
    }

    const toutesOffres = await Offre.findAll({
      include: [CliniqueDentaire],
      order: [['date_publication', 'DESC']]
    });

    const offresFiltrees = toutesOffres.filter(offre => {
      const clinique = offre.CliniqueDentaire;
      if (!clinique || !clinique.latitude || !clinique.longitude) return false;

      // Distance
      const distance = haversineDistance(
        parseFloat(professionnel.latitude),
        parseFloat(professionnel.longitude),
        parseFloat(clinique.latitude),
        parseFloat(clinique.longitude)
      );
      if (rayon_km && distance > parseFloat(rayon_km)) return false;

      // Type de professionnel
      if (filtrer_par_type && offre.type_professionnel !== professionnel.specialite) return false;

      return true;
    });

    res.json(offresFiltrees);
  } catch (error) {
    console.error('Erreur lors du filtrage des offres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getOffresProches = async (req, res) => {
  const { lat, lng, rayon } = req.query;

  if (!lat || !lng || !rayon) {
    return res.status(400).json({ message: "Latitude, longitude et rayon requis." });
  }

  try {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distanceKm = parseFloat(rayon);

    // Récupérer toutes les offres AVEC les cliniques associées
    const offres = await Offre.findAll({
      include: [{ model: CliniqueDentaire }],
      order: [['date_publication', 'DESC']]
    });

    // Filtrer manuellement avec la formule de Haversine
    const filtered = offres.filter((offre) => {
      const lat2 = offre.latitude;
      const lng2 = offre.longitude;

      if (lat2 == null || lng2 == null) return false;

      const toRad = deg => deg * Math.PI / 180;
      const R = 6371;
      const dLat = toRad(lat2 - latitude);
      const dLng = toRad(lng2 - longitude);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(latitude)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= distanceKm;
    });

    res.json(filtered);
  } catch (error) {
    console.error("Erreur récupération offres proches:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const getCandidaturesParOffre = async (req, res) => {
  try {
    const { id } = req.params;

    const candidatures = await Candidature.findAll({
      where: { id_offre: id }, // ← attention ici c’est bien `id_offre`, pas `offre_id`
      include: [
        {
          model: ProfessionnelDentaire,
          attributes: ['id_professionnel', 'type_profession', 'annees_experience'],
          include: [
            {
              model: User, // ← ton modèle Utilisateur
              attributes: ['id_utilisateur', 'nom', 'prenom', 'courriel']
            }
          ]
        }
      ],
      order: [['date_candidature', 'DESC']]
    });

    const candidats = candidatures.map(c => ({
      id_utilisateur: c.candidat.id_utilisateur,
      nom: `${c.candidat.prenom} ${c.candidat.nom}`,
      email: c.candidat.email
    }));

    res.json(candidats);
  } catch (error) {
    console.error("Erreur récupération candidats:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


module.exports = {
  getFilteredOffres,
  getOffresProches, 
  getCandidaturesParOffre
};
