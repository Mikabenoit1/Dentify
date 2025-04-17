import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/OfferCandidates.css';

const OfferCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOfferById, getCandidatesForOffer, assignCandidate, updateOffer } = useOffers();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  
  // Récupérer l'offre et ses candidats
  const offer = getOfferById(parseInt(id));
  const candidates = getCandidatesForOffer(parseInt(id));
  
  // Si l'offre n'existe pas, rediriger vers la liste des offres
  if (!offer) {
    return (
      <div className="candidates-container">
        <div className="dashboard-header">
          <h1>Candidatures</h1>
        </div>
        <div className="no-candidates">
          <p>Cette offre n'existe pas ou a été supprimée.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/clinique-offres')}
          >
            Retour à la liste des offres
          </button>
        </div>
      </div>
    );
  }
  
  // Gérer la sélection d'un candidat
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmationVisible(true);
  };
  
  // Confirmer la sélection d'un candidat
  const confirmSelection = () => {
    if (selectedCandidate) {
      // Extraire la partie base du titre sans le "Poste pourvu par X"
      let baseTitle = "Remplacement dentiste";
      
      // Si le titre contient déjà le format standard, on l'extrait
      if (offer.title.includes("Remplacement dentiste")) {
        const titleParts = offer.title.split(" - ");
        if (titleParts.length > 0) {
          baseTitle = titleParts[0];
        }
      }
      
      // Mettre à jour le titre de l'offre avec le nom du nouveau candidat
      const updatedOffer = {
        ...offer,
        title: `${baseTitle} - Poste pourvu par ${selectedCandidate.name}`,
        status: 'active',
        assignedCandidate: {
          id: selectedCandidate.id,
          name: selectedCandidate.name
        }
      };
      
      // Mettre à jour l'offre
      updateOffer(updatedOffer);
      
      // Mettre à jour le statut du candidat
      assignCandidate(offer.id, selectedCandidate.id);
      
      setConfirmationVisible(false);
      
      // Rediriger vers la page de détail de l'offre
      navigate(`/clinique-offres/${offer.id}`);
    }
  };
  
  // Annuler la sélection
  const cancelSelection = () => {
    setSelectedCandidate(null);
    setConfirmationVisible(false);
  };
  
  // Formater l'état d'un candidat
  const formatCandidateStatus = (status) => {
    switch (status) {
      case 'selected':
        return 'Sélectionné';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusé';
      default:
        return 'En attente';
    }
  };
  
  return (
    <div className="candidates-container">
      <div className="dashboard-header">
        <h1>Candidatures pour l'offre</h1>
        <button 
          className="back-button"
          onClick={() => navigate(`/clinique-offres/${offer.id}`)}
        >
          <i className="fa-solid fa-arrow-left"></i> Retour à l'offre
        </button>
      </div>
      
      <div className="offer-summary">
        <h2>{offer.title}</h2>
        <div className="offer-brief">
          <span className="offer-dates">
            <i className="fa-solid fa-calendar"></i> 
            {offer.startDate === offer.endDate 
              ? `Le ${offer.startDate}` 
              : `Du ${offer.startDate} au ${offer.endDate}`}
          </span>
          <span className="offer-profession">
            <i className="fa-solid fa-user-md"></i> 
            {offer.profession === 'dentiste' ? 'Dentiste' : 
             offer.profession === 'assistant' ? 'Assistant(e) dentaire' : 
             'Hygiéniste dentaire'}
          </span>
          <span className={`status-badge ${offer.status}`}>
            {offer.status === 'active' ? 'Active' : 
             offer.status === 'pending' ? 'En attente' : 'Expirée'}
          </span>
        </div>
        
        {offer.assignedCandidate && (
          <div className="assigned-candidate-banner">
            <i className="fa-solid fa-check-circle"></i>
            Poste actuellement pourvu par <strong>{offer.assignedCandidate.name}</strong>
          </div>
        )}
      </div>
      
      <div className="candidates-section">
        <h3>
          <i className="fa-solid fa-users"></i> 
          Candidats ({candidates.length})
        </h3>
        
        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>Aucune candidature n'a été reçue pour cette offre.</p>
          </div>
        ) : (
          <div className="candidates-list">
            {candidates.map(candidate => (
              <div key={candidate.id} className={`candidate-card ${candidate.status}`}>
                <div className="candidate-header">
                  <h4>{candidate.name}</h4>
                  <span className={`candidate-status ${candidate.status}`}>
                    {formatCandidateStatus(candidate.status)}
                  </span>
                </div>
                
                <div className="candidate-details">
                  <p><strong>Email:</strong> {candidate.email}</p>
                  <p><strong>Téléphone:</strong> {candidate.phone}</p>
                  <p><strong>Expérience:</strong> {candidate.experience}</p>
                  <p><strong>Disponibilité:</strong> {candidate.availability}</p>
                  <p><strong>Candidature reçue le:</strong> {candidate.applicationDate}</p>
                  {candidate.notes && (
                    <p><strong>Notes:</strong> {candidate.notes}</p>
                  )}
                </div>
                
                <div className="candidate-actions">
                  {candidate.status === 'selected' ? (
                    <span className="selected-badge">
                      <i className="fa-solid fa-check-circle"></i> Candidat sélectionné
                    </span>
                  ) : (
                    <button 
                      className="select-button"
                      onClick={() => handleSelectCandidate(candidate)}
                    >
                      <i className="fa-solid fa-user-check"></i> Sélectionner
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de confirmation */}
      {confirmationVisible && selectedCandidate && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirmer la sélection</h3>
            <p>
              Vous êtes sur le point de sélectionner <strong>{selectedCandidate.name}</strong> pour cette offre.
              Cette action changera le statut de l'offre à "Active" et marquera ce candidat comme sélectionné.
            </p>
            {offer.assignedCandidate && (
              <p className="warning-text">
                <i className="fa-solid fa-exclamation-triangle"></i> Attention: Ce poste est actuellement occupé par <strong>{offer.assignedCandidate.name}</strong>. Votre sélection remplacera ce candidat.
              </p>
            )}
            <p>Voulez-vous continuer ?</p>
            
            <div className="confirmation-actions">
              <button 
                className="cancel-button"
                onClick={cancelSelection}
              >
                Annuler
              </button>
              <button 
                className="confirm-button"
                onClick={confirmSelection}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferCandidates;