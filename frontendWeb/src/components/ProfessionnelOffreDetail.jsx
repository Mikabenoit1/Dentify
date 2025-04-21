import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOfferById } from '../lib/offerApi';
import { fetchCliniqueById } from '../lib/clinicApi';
import '../styles/ProfessionnelOffreDetail.css';

const ProfessionnelOffreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [offer, setOffer] = useState(null);
  const [clinique, setClinique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Charger l'offre
        const offerData = await fetchOfferById(id);
        setOffer(offerData);
        
        // Si l'offre est récupérée avec succès, charger les informations de la clinique
        if (offerData && offerData.id_clinique) {
          try {
            const cliniqueData = await fetchCliniqueById(offerData.id_clinique);
            setClinique(cliniqueData);
          } catch (clinicError) {
            console.error("Erreur lors du chargement des infos de la clinique:", clinicError);
            // On continue malgré l'erreur de chargement de la clinique
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement de l'offre:", err);
        setError("Impossible de charger les détails de l'offre");
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // Fonction pour formater les dates
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Date non spécifiée';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('fr-FR', options);
    const end = new Date(endDate).toLocaleDateString('fr-FR', options);
    
    return startDate === endDate ? `Le ${start}` : `Du ${start} au ${end}`;
  };

  // Fonction pour formater l'heure
  const formatTime = (timeStr) => {
    if (!timeStr) return 'Heure non spécifiée';
    
    try {
      // Pour les formats ISO avec fuseau horaire
      if (typeof timeStr === 'string' && timeStr.includes('T')) {
        const timeParts = timeStr.split('T')[1].split(':');
        if (timeParts.length >= 2) {
          return `${timeParts[0]}:${timeParts[1]}`;
        }
      }
      
      // Pour les formats simples "HH:MM"
      if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }
      
      // Dernier recours
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      
      return 'Heure invalide';
    } catch (error) {
      console.error('Erreur de formatage d\'heure:', error);
      return 'Heure invalide';
    }
  };

  // Calculer la durée de l'offre
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Durée non spécifiée';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.getTime() === end.getTime()) return '1 jour';
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mois`;
    return `${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="professionnel-offre-detail-container">
        <div className="detail-header">
          <h1>Détails de l'offre</h1>
        </div>
        <div className="loading-container">
          <p>Chargement des détails de l'offre...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="professionnel-offre-detail-container">
        <div className="detail-header">
          <h1>Détails de l'offre</h1>
        </div>
        <div className="error-container">
          <p>{error || "Cette offre n'existe pas ou a été supprimée."}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/offres')}
          >
            <i className="fa-solid fa-arrow-left"></i> Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  // Déterminer le nom et l'adresse de la clinique
  const cliniqueName = clinique?.nom || offer.nom_clinique || "Clinique inconnue";
  const cliniqueAddress = clinique?.adresse || offer.adresse_complete || "Adresse non spécifiée";
  const cliniqueInitial = cliniqueName.charAt(0).toUpperCase();
  
  // Générer une couleur basée sur le nom de la clinique (pour la consistance visuelle)
  const getColorFromName = (name) => {
    const colors = [
      '#4285f4', '#ea4335', '#fbbc05', '#34a853', // Google colors
      '#6f42c1', '#007bff', '#17a2b8', '#28a745'  // Bootstrap colors
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  const cliniqueColor = getColorFromName(cliniqueName);

  return (
    <div className="professionnel-offre-detail-container">
      <div className="detail-header">
        <h1>Détails de l'offre</h1>
        <button 
          className="back-button"
          onClick={() => navigate('/offres')}
        >
          <i className="fa-solid fa-arrow-left"></i> Retour aux offres
        </button>
      </div>
      
      <div className="offer-detail-card">
        <div className="offer-status-header">
          <h2>{offer.titre}</h2>
          <div className="offer-status">
            <span className={`status-badge ${offer.statut}`}>
              {offer.statut === 'active' ? 'Active' : 
               offer.statut === 'archivée' ? 'Archivée' : 
               offer.statut === 'expired' ? 'Expirée' : 'En attente'}
            </span>
            {offer.est_urgent === 'Y' && (
              <span className="urgent-badge">
                <i className="fa-solid fa-exclamation-triangle"></i> Urgent
              </span>
            )}
          </div>
        </div>
        
        <div className="clinique-info">
          <div className="clinique-avatar" style={{ backgroundColor: cliniqueColor }}>
            {cliniqueInitial}
          </div>
          <div className="clinique-details">
            <h3>{cliniqueName}</h3>
            <p>
              <i className="fa-solid fa-location-dot"></i> {cliniqueAddress}
            </p>
          </div>
        </div>
        
        <div className="offer-details-section">
          <div className="offer-detail-row">
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fa-solid fa-user-md"></i>
              </div>
              <div className="detail-content">
                <h4>Profession</h4>
                <p>{offer.type_professionnel === 'dentiste' ? 'Dentiste' : 
                   offer.type_professionnel === 'assistant' ? 'Assistant(e) dentaire' : 
                   'Hygiéniste dentaire'}</p>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fa-solid fa-calendar"></i>
              </div>
              <div className="detail-content">
                <h4>Période</h4>
                <p>{formatDateRange(offer.date_debut, offer.date_fin)}</p>
              </div>
            </div>
          </div>
          
          <div className="offer-detail-row">
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div className="detail-content">
                <h4>Horaires</h4>
                <p>{formatTime(offer.heure_debut)} à {formatTime(offer.heure_fin)}</p>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <div className="detail-content">
                <h4>Durée</h4>
                <p>{calculateDuration(offer.date_debut, offer.date_fin)}</p>
              </div>
            </div>
          </div>
          
          <div className="offer-detail-row">
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fa-solid fa-money-bill-wave"></i>
              </div>
              <div className="detail-content">
                <h4>Rémunération</h4>
                <p>{offer.remuneration ? `${offer.remuneration} $ CAD` : 'Non spécifiée'}</p>                </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div className="detail-content">
                <h4>Publication</h4>
                <p>{offer.date_publication ? new Date(offer.date_publication).toLocaleDateString('fr-FR') : 'Date inconnue'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="offer-description-section">
          <h3>Description</h3>
          <div className="description-content">
            <p>{offer.descript || 'Aucune description disponible.'}</p>
          </div>
        </div>
        
        {offer.competences_requises && (
          <div className="offer-requirements-section">
            <h3>Compétences requises</h3>
            <div className="requirements-content">
              <p>{offer.competences_requises}</p>
            </div>
          </div>
        )}
        
        <div className="offer-action-section">
          <button 
            className="back-button primary-button"
            onClick={() => navigate('/offres')}
          >
            <i className="fa-solid fa-arrow-left"></i> Retour à la liste des offres
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionnelOffreDetail;