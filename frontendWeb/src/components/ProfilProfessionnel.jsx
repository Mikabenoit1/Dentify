import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiFetch';
import '../styles/ProfilProfessionnel.css';

const ProfilProfessionnel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professionnel, setProfessionnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessionnelProfile = async () => {
      try {
        setLoading(true);
        // Récupérer les détails du professionnel depuis l'API
        const response = await apiFetch(`/professionnels/${id}`);
        console.log("Données du professionnel:", response);
        setProfessionnel(response);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du profil professionnel:", err);
        setError("Impossible de charger le profil du professionnel");
        setLoading(false);
      }
    };

    if (id) {
      fetchProfessionnelProfile();
    }
  }, [id]);

  // Formatage des dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-CA', options);
    } catch (error) {
      return dateString;
    }
  };

  // Récupérer l'URL de la photo de profil
  const getPhotoUrl = (photoFilename) => {
    if (!photoFilename) return '/img/default-avatar.png';
    return `/uploads/photos/${photoFilename}`;
  };

  if (loading) {
    return (
      <div className="profil-container">
        <div className="dashboard-header">
          <h1>Profil Professionnel</h1>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !professionnel) {
    return (
      <div className="profil-container">
        <div className="dashboard-header">
          <h1>Profil Professionnel</h1>
        </div>
        <div className="error-container">
          <p>{error || "Ce professionnel n'existe pas ou a été supprimé."}</p>
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i> Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profil-container">
      <div className="dashboard-header">
        <h1>Profil Professionnel</h1>
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <i className="fa-solid fa-arrow-left"></i> Retour
        </button>
      </div>

      <div className="profil-content">
        <div className="profil-header">
          <div className="profil-photo">
            <img 
              src={getPhotoUrl(professionnel.User?.photo_profil)} 
              alt={professionnel.User?.nom || "Photo de profil"} 
            />
          </div>
          <div className="profil-info">
            <h2>{professionnel.User?.prenom} {professionnel.User?.nom}</h2>
            <p className="profil-type">
              {professionnel.type_profession === 'dentiste' ? 'Dentiste' : 
               professionnel.type_profession === 'assistant' ? 'Assistant(e) dentaire' : 
               'Hygiéniste dentaire'}
            </p>
            <div className="profil-contact">
              <p><i className="fa-solid fa-envelope"></i> {professionnel.User?.courriel}</p>
              <p><i className="fa-solid fa-phone"></i> {professionnel.User?.telephone || 'Non spécifié'}</p>
            </div>
          </div>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-user"></i> À propos</h3>
          <p>{professionnel.description || 'Aucune description fournie.'}</p>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-briefcase"></i> Expérience professionnelle</h3>
          <div className="profil-experience">
            <p><strong>Années d'expérience :</strong> {professionnel.annees_experience || 'Non spécifié'} ans</p>
            {professionnel.experiences?.length > 0 ? (
              <ul className="experience-list">
                {professionnel.experiences.map((exp, index) => (
                  <li key={index} className="experience-item">
                    <h4>{exp.poste}</h4>
                    <p>{exp.etablissement} | {exp.lieu}</p>
                    <p className="experience-dates">
                      De {formatDate(exp.debut)} à {exp.fin ? formatDate(exp.fin) : 'Aujourd\'hui'}
                    </p>
                    <p>{exp.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune expérience détaillée fournie.</p>
            )}
          </div>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-graduation-cap"></i> Formation</h3>
          {professionnel.educations?.length > 0 ? (
            <ul className="education-list">
              {professionnel.educations.map((edu, index) => (
                <li key={index} className="education-item">
                  <h4>{edu.diplome}</h4>
                  <p>{edu.etablissement} | {edu.annee}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune formation détaillée fournie.</p>
          )}
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-stethoscope"></i> Compétences</h3>
          <div className="tags-container">
            {professionnel.competences?.length > 0 ? (
              professionnel.competences.map((competence, index) => (
                <span key={index} className="tag">{competence}</span>
              ))
            ) : (
              <p>Aucune compétence spécifiée.</p>
            )}
          </div>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-language"></i> Langues parlées</h3>
          <div className="tags-container">
            {professionnel.langues?.length > 0 ? (
              professionnel.langues.map((langue, index) => (
                <span key={index} className="tag">{langue}</span>
              ))
            ) : (
              <p>Aucune langue spécifiée.</p>
            )}
          </div>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-car"></i> Mobilité</h3>
          <p><strong>Adresse :</strong> {professionnel.adresse || 'Non spécifiée'}</p>
          <p><strong>Rayon de déplacement :</strong> {professionnel.rayon_deplacement_km || 0} km</p>
          <p>
            <strong>Véhicule :</strong> 
            {professionnel.vehicule ? (
              <span className="has-vehicle"><i className="fa-solid fa-check-circle"></i> Oui</span>
            ) : (
              <span className="no-vehicle"><i className="fa-solid fa-times-circle"></i> Non</span>
            )}
          </p>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-calendar-alt"></i> Disponibilité</h3>
          <p><strong>Disponible immédiatement :</strong> 
            {professionnel.disponibilite_immediate ? (
              <span className="disponible"><i className="fa-solid fa-check-circle"></i> Oui</span>
            ) : (
              <span className="non-disponible"><i className="fa-solid fa-times-circle"></i> Non</span>
            )}
          </p>
          {professionnel.date_debut_dispo && professionnel.date_fin_dispo && (
            <p><strong>Période de disponibilité :</strong> Du {formatDate(professionnel.date_debut_dispo)} au {formatDate(professionnel.date_fin_dispo)}</p>
          )}
          <p><strong>Tarif horaire :</strong> {professionnel.tarif_horaire || 'Non spécifié'} $/h</p>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-file-alt"></i> Documents disponibles</h3>
          <div className="documents-list">
            {Object.entries(professionnel.documents || {}).length > 0 ? (
              Object.entries(professionnel.documents).map(([type, filename]) => (
                <div key={type} className="document-item">
                  <i className="fa-solid fa-file-pdf"></i>
                  <span>{type === 'cv' ? 'CV' : 
                        type === 'diplome' ? 'Diplôme' : 
                        type === 'inscription' ? 'Inscription ordre professionnel' : 
                        type}</span>
                  <span className="document-verified">
                    <i className="fa-solid fa-check-circle"></i> Vérifié
                  </span>
                </div>
              ))
            ) : (
              <p>Aucun document disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilProfessionnel;