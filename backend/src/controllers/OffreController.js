const { Offre, CliniqueDentaire } = require('../models');
const { Op } = require('sequelize');

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

module.exports = {
  getFilteredOffres
};
