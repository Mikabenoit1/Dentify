// 📁 utils/systemMessages.js

module.exports = {
    candidatureReçue: '📥 Nouvelle candidature reçue',
    candidatureAcceptée: (titreOffre) => `🎉 Votre candidature pour "${titreOffre}" a été acceptée.`,
    candidatureRefusée: (titreOffre) => `❌ Votre candidature à l'offre "${titreOffre}" n'a pas été retenue.`,
    entretienPlanifié: (date, heure) => `📅 Entretien planifié le ${date} à ${heure}.`,
    offreAnnulée: (titreOffre) => `⚠️ L'offre "${titreOffre}" a été annulée par la clinique.`,
  };
  