import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/CliniqueOffre.css';

const CliniqueOffreDetail = () => {
  const { id } = useParams();
  const { getOfferById, deleteOffer, getCandidatesForOffer } = useOffers();
  const navigate = useNavigate();
  
  // Récupérer l'offre par son ID
  const offer = getOfferById(parseInt(id));
  
  // Récupérer les candidats pour cette offre
  const candidates = offer ? getCandidatesForOffer(parseInt(id)) : [];
  
  // Si l'offre n'existe pas, rediriger vers la liste des offres
  if (!offer) {
    return (
      <div className="clinique-offre-container">
        <div className="dashboard-header">
          <h1>Détails de l'offre</h1>
        </div>
        <div className="no-offers">
          <p>Cette offre n'existe pas ou a été supprimée.</p>
          <button 
            className="create-first-offer-button"
            onClick={() => navigate('/clinique-offres')}
          >
            Retour à la liste des offres
          </button>
        </div>
      </div>
    );
  }
  
  // Formater les dates pour l'affichage
  const formatDateRange = () => {
    if (offer.startDate === offer.endDate) {
      return `Le ${offer.startDate}`;
    } else {
      return `Du ${offer.startDate} au ${offer.endDate}`;
    }
  };
  
  // Fonction pour supprimer l'offre
  const handleDeleteOffer = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      deleteOffer(parseInt(id));
      navigate('/clinique-offres');
    }
  };
  
  // Naviguer vers la page des candidats
  const viewCandidates = () => {
    navigate(`/candidats/${offer.id}`);
  };
  
  return (
    <div className="clinique-offre-container">
      <div className="dashboard-header">
        <h1>Détails de l'offre</h1>
        <button 
          className="back-button"
          onClick={() => navigate('/clinique-offres')}
        >
          <i className="fa-solid fa-arrow-left"></i> Retour aux offres
        </button>
      </div>
      
      <div className="offer-detail-card">
        <div className="offer-detail-header">
          <h2>{offer.title}</h2>
          <span className={`status-badge ${offer.status}`}>
            {offer.status === 'active' ? 'Active' : 
             offer.status === 'pending' ? 'En attente' : 'Expirée'}
          </span>
        </div>
        
        {/* Bannière si un candidat est assigné */}
        {offer.assignedCandidate && (
          <div className="assigned-candidate-banner">
            <i className="fa-solid fa-check-circle"></i>
            Poste actuellement pourvu par <strong>{offer.assignedCandidate.name}</strong>
          </div>
        )}
        
        <div className="offer-detail-section">
          <h3>Informations générales</h3>
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Profession:</span>
              <span className="detail-value">
                {offer.profession === 'dentiste' ? 'Dentiste' : 
                 offer.profession === 'assistant' ? 'Assistant(e) dentaire' : 
                 'Hygiéniste dentaire'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date de publication:</span>
              <span className="detail-value">{offer.datePosted}</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Période:</span>
              <span className="detail-value">{formatDateRange()}</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Horaires:</span>
              <span className="detail-value">
                {offer.startTime || "09:00"} à {offer.endTime || "17:00"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="offer-detail-section">
          <h3>Description</h3>
          <p>{offer.description}</p>
        </div>
        
        <div className="offer-detail-section">
          <h3>Exigences</h3>
          <p>{offer.requirements || "Aucune exigence spécifiée."}</p>
        </div>
        
        <div className="offer-detail-section">
          <h3>Rémunération</h3>
          <p>{offer.compensation}</p>
        </div>
        
        <div className="offer-detail-section">
          <h3>Candidatures</h3>
          <p>
            <i className="fa-solid fa-user-group"></i> 
            {candidates.length} candidature(s) reçue(s)
          </p>
          {candidates.length > 0 && (
            <button 
              className="applications-button"
              onClick={viewCandidates}
            >
              <i className="fa-solid fa-users"></i> Voir les candidats
            </button>
          )}
        </div>
        
        <div className="offer-detail-actions">
          <button 
            className="edit-button"
            onClick={() => navigate(`/clinique-cree/${offer.id}`)}
          >
            <i className="fa-solid fa-pen"></i> Modifier l'offre
          </button>
          <button 
            className="delete-button"
            onClick={handleDeleteOffer}
          >
            <i className="fa-solid fa-trash"></i> Supprimer l'offre
          </button>
        </div>
      </div>
    </div>
  );
};

export default CliniqueOffreDetail;