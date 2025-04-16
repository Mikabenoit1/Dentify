import React from 'react';
import "../styles/Professions.css";
import { FaTooth, FaUserNurse, FaClinicMedical } from "react-icons/fa";

const Professions = () => {
  return (
    <div className="professions-container">
      <h1 className="Pro">Nos Professions</h1>
      <div className="professions-grid">
        <div className="profession">
          <FaTooth className="profession-icon"/>
          <h2>Dentistes</h2>
          <h8>Le dentiste est un professionnel de santé spécialisé dans le diagnostic, la prévention et le traitement des maladies et affections bucco-dentaires. Il réalise des examens complets, effectue des soins comme les obturations (plombages), les extractions, pose des prothèses dentaires et des implants, et traite les problèmes de gencives. Le dentiste supervise l'équipe dentaire et élabore des plans de traitement personnalisés pour chaque patient.</h8>
        </div>
        <div className="profession">
          <FaUserNurse className="profession-icon"/>
          <h2>Hygiénistes Dentaires</h2>
          <h8>L'hygiéniste dentaire est un spécialiste de la prévention et du maintien de la santé bucco-dentaire. Il réalise des détartrages professionnels, des polissages et applique des traitements préventifs comme les scellants et les fluorures. L'hygiéniste fournit également des conseils personnalisés sur les techniques de brossage, l'utilisation du fil dentaire et l'importance d'une bonne hygiène bucco-dentaire pour prévenir les caries et les maladies des gencives.</h8>
        </div>
        <div className="profession">
          <FaClinicMedical className="profession-icon"/>
          <h2>Assistants Dentaires</h2>
          <h8>L'assistant dentaire travaille aux côtés du dentiste pour assurer le bon déroulement des soins. Il prépare le matériel, aide pendant les interventions, prend des empreintes dentaires et des radiographies. L'assistant dentaire veille au confort du patient, assure la stérilisation des instruments et l'entretien de l'équipement. Il peut également s'occuper de tâches administratives comme la gestion des rendez-vous et l'accueil des patients.</h8>
        </div>
      </div>
    </div>
  );
};

export default Professions;

