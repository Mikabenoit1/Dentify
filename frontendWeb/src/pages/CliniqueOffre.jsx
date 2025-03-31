import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/CliniqueOffre.css';

const CliniqueOffre = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const { offers, deleteOffer, getCandidatesForOffer } = useOffers();
  const navigate = useNavigate();

  // Filtre les offres en fonction du statut sélectionné
  const filteredOffers = filterStatus === 'all' 
    ? offers 
    : offers.filter(offer => offer.status === filterStatus);

  // Suppression d'une offre
  const handleDeleteOffer = (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      deleteOffer(offerId);
    }
  };

  // Navigation vers la page de création d'offre
  const handleCreateOffer = () => {
    navigate('/clinique-cree');
  };

  // Navigation vers la page de détail/modification de l'offre
  const handleViewOffer = (offerId) => {
    navigate(`/clinique-offres/${offerId}`);
  };

  // Navigation vers la page des candidats
  const viewCandidates = (offerId, event) => {
    event.stopPropagation(); // Empêcher la propagation pour éviter de naviguer vers la vue détaillée
    navigate(`/candidats/${offerId}`);
  };

  // Formater les dates pour l'affichage
  const formatDateRange = (startDate, endDate) => {
    if (startDate === endDate) {
      return `Le ${startDate}`;
    } else {
      return `Du ${startDate} au ${endDate}`;
    }
  };

  return (
    <div className="clinique-offre-container">
      <div className="dashboard-header">
        <h1>Mes Offres</h1>
      </div>

      <div className="offers-section">
        <div className="controls">
          <div className="filter-controls">
            <label>Filtrer par statut:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Toutes les offres</option>
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="expired">Expirées</option>
            </select>
          </div>
          <button 
            className="create-button"
            onClick={handleCreateOffer}
          >
            <i className="fa-solid fa-plus"></i> Nouvelle offre
          </button>
        </div>

        <div className="offers-list">
          {filteredOffers.length === 0 ? (
            <div className="no-offers">
              <p>Aucune offre trouvée pour ce filtre.</p>
              <button 
                className="create-first-offer-button"
                onClick={handleCreateOffer}
              >
                Créer votre première offre
              </button>
            </div>
          ) : (
            filteredOffers.map(offer => {
              // Récupérer les candidats pour cette offre
              const candidatesCount = getCandidatesForOffer ? getCandidatesForOffer(offer.id).length : 0;
              
              return (
                <div key={offer.id} className={`offer-card ${offer.status}`}>
                  <div className="offer-header">
                    <h3>{offer.title}</h3>
                    <div className="offer-status">
                      <span className={`status-badge ${offer.status}`}>
                        {offer.status === 'active' ? 'Active' : 
                         offer.status === 'pending' ? 'En attente' : 'Expirée'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Bannière si un candidat est assigné */}
                  {offer.assignedCandidate && (
                    <div className="assigned-candidate-banner">
                      <i className="fa-solid fa-check-circle"></i>
                      Poste pourvu par <strong>{offer.assignedCandidate.name}</strong>
                    </div>
                  )}
                  
                  <div className="offer-details">
                    <p><strong>Profession:</strong> {offer.profession === 'dentiste' ? 'Dentiste' : 
                                              offer.profession === 'assistant' ? 'Assistant(e) dentaire' : 
                                              'Hygiéniste dentaire'}</p>
                    <p><strong>Période:</strong> {formatDateRange(offer.startDate, offer.endDate)}</p>
                    <p><strong>Publiée le:</strong> {offer.datePosted}</p>
                  </div>
                  
                  <div className="offer-actions">
                    <button 
                      className="view-button"
                      onClick={() => handleViewOffer(offer.id)}
                    >
                      <i className="fa-solid fa-eye"></i> Voir l'offre
                    </button>
                    <button 
                      className="edit-button"
                      onClick={() => navigate(`/clinique-cree/${offer.id}`)}
                    >
                      <i className="fa-solid fa-pen"></i> Modifier
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      <i className="fa-solid fa-trash"></i> Supprimer
                    </button>
                  </div>
                  
                  <div className="applications-info">
                    <p>
                      <i className="fa-solid fa-user-group"></i> 
                      {candidatesCount} candidature(s)
                    </p>
                    {candidatesCount > 0 && (
                      <button 
                        className="applications-button"
                        onClick={(e) => viewCandidates(offer.id, e)}
                      >
                        <i className="fa-solid fa-users"></i> Voir les candidats
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CliniqueOffre;