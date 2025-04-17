const { Evaluation, Offre, User } = require('../models');
const { Op } = require('sequelize');

// Créer une évaluation
exports.createEvaluation = async (req, res) => {
  const { evaluateur_id, evalue_id, id_offre, note, commentaire } = req.body;

  // Vérification des données nécessaires
  if (!evaluateur_id || !evalue_id || !id_offre || !note) {
    return res.status(400).json({ message: 'Tous les champs sont requis : evaluateur_id, evalue_id, id_offre, note.' });
  }

  try {
    // Création de l'évaluation
    const evaluation = await Evaluation.create({
      evaluateur_id,
      evalue_id,
      id_offre,
      note,
      commentaire,
      date_evaluation: new Date(),
    });
    res.status(201).json({ message: 'Évaluation créée avec succès', evaluation });
  } catch (error) {
    console.error(error);
    // Cas particulier où l'erreur vient d'un problème d'intégrité (par exemple, un ID d'utilisateur inexistant)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Une ou plusieurs clés étrangères sont invalides', error });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l\'évaluation', error });
  }
};

// Récupérer toutes les évaluations d'une offre
exports.getEvaluationsByOffre = async (req, res) => {
  const { id_offre } = req.params;

  try {
    const evaluations = await Evaluation.findAll({
      where: { id_offre },
      include: [
        {
          model: User,
          as: 'evaluateur',
          attributes: ['id_utilisateur', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'evalue',
          attributes: ['id_utilisateur', 'nom', 'prenom']
        },
      ],
    });
    res.status(200).json(evaluations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des évaluations', error });
  }
};

// Récupérer toutes les évaluations d'un utilisateur (clinique ou professionnel)
exports.getEvaluationsByUser = async (req, res) => {
  const { id_utilisateur } = req.params;

  try {
    const evaluations = await Evaluation.findAll({
      where: {
        [Op.or]: [
          { evaluateur_id: id_utilisateur },
          { evalue_id: id_utilisateur }
        ]
      },
      include: [
        {
          model: Offre,
          attributes: ['id_offre', 'titre'],
        }
      ],
    });
    res.status(200).json(evaluations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des évaluations', error });
  }
};
