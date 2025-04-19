import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOffersForClinic, deleteOffer } from '../lib/offerApi';
import '../styles/CliniqueOffre.css';

const CliniqueOffre = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchOffersForClinic();
        setOffers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
      }
    };

    loadOffers();
  }, []);

  const formatHeure = (heureStr) => {
    if (!heureStr) return 'Heure inconnue';
    
    try {
      // Pour les formats ISO avec fuseau horaire (se terminant par Z ou +/-XX:XX)
      if (typeof heureStr === 'string' && 
          (heureStr.endsWith('Z') || /T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:[+-]\d{2}:\d{2})?$/.test(heureStr))) {
        
        // Extraire directement l'heure:minute de la chaîne ISO
        const timeParts = heureStr.split('T')[1].split(':');
        if (timeParts.length >= 2) {
          return `${timeParts[0]}:${timeParts[1]}`;
        }
      }
      
      // Pour les formats simples "HH:MM" ou "HH:MM:SS"
      if (typeof heureStr === 'string' && heureStr.includes(':') && !heureStr.includes('T')) {
        const parts = heureStr.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }
      
      // Dernier recours
      const date = new Date(heureStr);
      if (!isNaN(date.getTime())) {
        const isoString = date.toISOString();
        const timePart = isoString.split('T')[1].substring(0, 5);
        return timePart;
      }
      
      return 'Heure invalide';
    } catch (error) {
      console.error('Erreur de formatage d\'heure:', error);
      return 'Heure invalide';
    }
  };


  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await deleteOffer(offerId);
        setOffers(prev => prev.filter(o => o.id_offre !== offerId));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("❌ Suppression échouée.");
      }
    }
  };

  const handleCreateOffer = () => {
    navigate('/clinique-cree');
  };

  const handleViewOffer = (offerId) => {
    navigate(`/clinique-offres/${offerId}`);
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Date inconnue';
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
    const start = new Date(startDate).toLocaleDateString('fr-CA', options);
    const end = new Date(endDate).toLocaleDateString('fr-CA', options);
  
    return startDate === endDate
      ? `Le ${start}`
      : `Du ${start} au ${end}`;
  };
  
  

  const filteredOffers = filterStatus === 'all'
    ? offers
    : offers.filter(offer => offer.statut === filterStatus);

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
            filteredOffers.map(offer => (
              <div key={offer.id_offre} className={`offer-card ${offer.statut}`}>
                <div className="offer-header">
                  <h3>{offer.titre}</h3>
                  <div className="offer-status">
                    <span className={`status-badge ${offer.statut}`}>
                      {offer.statut === 'active' ? 'Active' : 
                       offer.statut === 'pending' ? 'En attente' : 'Expirée'}
                    </span>
                  </div>
                </div>

             <div className="offer-details">
  <p><strong>Profession:</strong> {offer.type_professionnel}</p>

  <p><strong>Période:</strong> {
  formatDateRange(offer.date_debut, offer.date_fin)
}</p>

{offer.heure_debut && offer.heure_fin && (
  <p><strong>Horaires:</strong> {formatHeure(offer.heure_debut)} à {formatHeure(offer.heure_fin)}</p>
)}

  <p><strong>Publiée le:</strong> {
    offer.date_publication
      ? new Date(offer.date_publication).toLocaleDateString('fr-CA')
      : 'Inconnue'
  }</p>
</div>


                <div className="offer-actions">
                  <button 
                    className="view-button"
                    onClick={() => handleViewOffer(offer.id_offre)}
                  >
                    <i className="fa-solid fa-eye"></i> Voir l'offre
                  </button>
                  <button 
                    className="edit-button"
                    onClick={() => navigate(`/clinique-cree/${offer.id_offre}`)}
                  >
                    <i className="fa-solid fa-pen"></i> Modifier
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteOffer(offer.id_offre)}
                  >
                    <i className="fa-solid fa-trash"></i> Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CliniqueOffre;
