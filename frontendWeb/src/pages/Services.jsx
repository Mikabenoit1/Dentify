import "../styles/Services.css"; 
import React from 'react';
import { FaCalendarAlt, FaComments, FaBell, FaFileMedical, FaUserMd, FaClipboardList, FaUsers } from "react-icons/fa";

/**
 * Composant affichant les différentes fonctionnalités de la plateforme,
 * divisées en deux catégories : Professionnels Dentaires et Cliniques Dentaires.
 */

// Fonctionnalités pour les Professionnels Dentaires
const professionalFeatures = [
  { 
    icon: <FaCalendarAlt />, 
    title: "Gestion des disponibilités", 
    desc: "Planifiez vos disponibilités avec un calendrier intégré et postulez aux offres correspondantes." 
  },
  { 
    icon: <FaComments />, 
    title: "Messagerie intégrée", 
    desc: "Communiquez directement avec les cliniques pour discuter des détails des missions." 
  },
  { 
    icon: <FaBell />, 
    title: "Notifications intelligentes", 
    desc: "Recevez des alertes en temps réel pour les nouvelles offres et les rappels de mission." 
  },
  { 
    icon: <FaFileMedical />, 
    title: "Profil professionnel", 
    desc: "Mettez en avant vos compétences, certifications et expériences pour attirer les meilleures opportunités." 
  }
];

// Fonctionnalités pour les Cliniques Dentaires
const clinicFeatures = [
  { 
    icon: <FaClipboardList />, 
    title: "Gestion des offres de remplacement", 
    desc: "Créez, modifiez et suivez vos annonces de recrutement en toute simplicité." 
  },
  { 
    icon: <FaUserMd />, 
    title: "Sélection des candidats", 
    desc: "Accédez aux profils détaillés des professionnels et sélectionnez le candidat idéal." 
  },
  { 
    icon: <FaUsers />, 
    title: "Historique et évaluation", 
    desc: "Consultez les missions passées et notez les candidats pour optimiser vos recrutements futurs." 
  }
];

const Services = () => {
  return (
    <div className="fonctionnalites">
      <h1>Nos Fonctionnalités</h1>

      <h2>Pour les Professionnels Dentaires</h2>
      <div className="features-container">
        {professionalFeatures.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-circle">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>

      <h2>Pour les Cliniques Dentaires</h2>
      <div className="features-container">
        {clinicFeatures.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-circle">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
