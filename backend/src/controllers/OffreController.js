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

    // Formule de Haversine pour calcul de distance entre 2 points
    const offres = await Offre.findAll({
      where: literal(`(
        6371 * acos(
          cos(radians(${latitude})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(latitude))
        )
      ) <= ${distanceKm}`),
      order: [['date_publication', 'DESC']]
    });

    res.json(offres);
  } catch (error) {
    console.error("Erreur récupération offres proches:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {
  getFilteredOffres,
  getOffresProches
};
