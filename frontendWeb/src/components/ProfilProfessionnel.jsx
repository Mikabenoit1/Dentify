import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch, FILE_BASE_URL } from '../lib/apiFetch';
import '../styles/ProfilProfessionnel.css';

const ProfilProfessionnel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professionnel, setProfessionnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfessionnelProfile = async () => {
      try {
        setLoading(true);
        console.log("Tentative de chargement direct du profil professionnel ID:", id);
        
        try {
          // Essayer d'abord la nouvelle route dédiée
          const profilData = await apiFetch(`/users/professionnels/${id}`);
          console.log("Données du professionnel via la route dédiée:", profilData);
          setProfessionnel(profilData);
          setLoading(false);
          return;
        } catch (err) {
          console.log("Route dédiée non disponible, utilisation de l'alternative...");
        }
        
        // Alternative: Récupérer via la route /professionnels/:id
        try {
          const profilData = await apiFetch(`/professionnels/${id}`);
          console.log("Données du professionnel via /professionnels:", profilData);
          
          // Si on a pu récupérer certaines données
          if (profilData) {
            // Essayer de récupérer les informations utilisateur associées
            try {
              const userData = await apiFetch(`/users/${profilData.id_utilisateur}`);
              profilData.User = userData;
            } catch (userErr) {
              console.log("Impossible de récupérer les données utilisateur");
            }
            
            setProfessionnel(profilData);
            setLoading(false);
            return;
          }
        } catch (proErr) {
          console.log("Route /professionnels non disponible, utilisation du plan C...");
        }
        
        // Plan C: Utiliser la méthode actuelle avec les candidatures
        const candidatures = await apiFetch(`/candidatures/professionnel/${id}`);
        
        if (Array.isArray(candidatures) && candidatures.length > 0) {
          const offreId = candidatures[0].id_offre;
          const offreCandidatures = await apiFetch(`/offres/${offreId}/candidatures`);
          
          const candidatTrouve = offreCandidatures.find(c => 
            c.id_professionnel === parseInt(id)
          );
          
          if (candidatTrouve) {
            setProfessionnel(candidatTrouve.ProfessionnelDentaire || candidatTrouve);
          } else {
            throw new Error("Impossible de trouver les données du professionnel");
          }
        } else {
          throw new Error("Aucune candidature trouvée pour ce professionnel");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur finale:", err);
        setError("Impossible de charger les données du professionnel");
        
        // Créer un profil minimal en cas d'échec total
        setProfessionnel({
          id_professionnel: parseInt(id),
          type_profession: "professionnel",
          competences: [],
          langues: [],
          documents: {},
          User: {
            nom: "Professionnel",
            prenom: `#${id}`,
            courriel: "Non disponible"
          }
        });
        
        setLoading(false);
      }
    };

    if (id) {
      loadProfessionnelProfile();
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
    if (photoFilename.startsWith('http')) return photoFilename;
    
    // Construire l'URL complète avec le chemin de base
    const baseUrl = FILE_BASE_URL || '';
    return `${baseUrl}/uploads/photos/${photoFilename}`;
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

  if (!professionnel) {
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

  // Extraire les informations de l'utilisateur avec des valeurs par défaut
  const userInfo = professionnel.User || professionnel.Utilisateur || {};

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
              src={getPhotoUrl(userInfo.photo_profil)} 
              alt={userInfo.nom || "Photo de profil"} 
            />
          </div>
          <div className="profil-info">
            <h2>{userInfo.prenom || ''} {userInfo.nom || ''}</h2>
            <p className="profil-type">
              {professionnel.type_profession === 'dentiste' ? 'Dentiste' : 
               professionnel.type_profession === 'assistant' ? 'Assistant(e) dentaire' : 
               professionnel.type_profession === 'hygieniste' ? 'Hygiéniste dentaire' :
               'Professionnel dentaire'}
            </p>
            <div className="profil-contact">
              <p><i className="fa-solid fa-envelope"></i> {userInfo.courriel || professionnel.email || 'Non spécifié'}</p>
              <p><i className="fa-solid fa-phone"></i> {userInfo.telephone || professionnel.telephone || 'Non spécifié'}</p>
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
                    <h4>{exp.poste || 'Poste non spécifié'}</h4>
                    <p>{exp.etablissement || 'Établissement non spécifié'} {exp.lieu ? `| ${exp.lieu}` : ''}</p>
                    <p className="experience-dates">
                      De {formatDate(exp.debut)} {exp.fin ? `à ${formatDate(exp.fin)}` : "à Aujourd'hui"}
                    </p>
                    <p>{exp.description || 'Aucune description disponible'}</p>
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
                  <h4>{edu.diplome || 'Diplôme non spécifié'}</h4>
                  <p>{edu.etablissement || 'Établissement non spécifié'} {edu.annee ? `| ${edu.annee}` : ''}</p>
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
            {Array.isArray(professionnel.competences) && professionnel.competences.length > 0 ? (
              professionnel.competences.map((competence, index) => (
                <span key={index} className="tag">{competence}</span>
              ))
            ) : professionnel.competences && typeof professionnel.competences === 'string' ? (
              <span className="tag">{professionnel.competences}</span>
            ) : (
              <p>Aucune compétence spécifiée.</p>
            )}
          </div>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-language"></i> Langues parlées</h3>
          <div className="tags-container">
            {Array.isArray(professionnel.langues) && professionnel.langues.length > 0 ? (
              professionnel.langues.map((langue, index) => (
                <span key={index} className="tag">{langue}</span>
              ))
            ) : professionnel.langues && typeof professionnel.langues === 'string' ? (
              <span className="tag">{professionnel.langues}</span>
            ) : (
              <p>Aucune langue spécifiée.</p>
            )}
          </div>
        </div>

        <div className="profil-section">
          <h3><i className="fa-solid fa-car"></i> Mobilité</h3>
          <p><strong>Adresse :</strong> {professionnel.adresse || userInfo.adresse || 'Non spécifiée'}</p>
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
                    <span>
                        {type === 'cv' ? 'CV' :
                        type === 'diplome' ? 'Diplôme' :
                        type === 'inscription' ? "Inscription à l'ordre" : type}
                    </span>
                    <a
                        className="download-link"
                        href={`${FILE_BASE_URL}/uploads/documents/${filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                    >
                        Télécharger
                    </a>
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