import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOfferById, deleteOffer, updateOffer } from '../lib/offerApi';
import { apiFetch } from '../lib/apiFetch';
import '../styles/CliniqueOffre.css';

const CliniqueOffreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadOfferAndCandidatures = async () => {
      try {
        setLoading(true);
        // Charger les détails de l'offre
        const offerData = await fetchOfferById(id);
        setOffer(offerData);
        
        // Essayer de charger les candidatures pour cette offre
        try {
          const candidaturesData = await apiFetch(`/offres/${id}/candidatures`);
          setCandidatures(candidaturesData);
          
          // Si l'offre est en état "pending" et qu'il y a des candidatures, mettre à jour son statut
          if (offerData.statut === 'pending' && Array.isArray(candidaturesData) && candidaturesData.length > 0) {
            try {
              const updatedOffer = { ...offerData, statut: 'active' };
              await updateOffer(id, updatedOffer);
              setOffer(updatedOffer);
            } catch (updateErr) {
              console.error("Erreur lors de la mise à jour du statut de l'offre:", updateErr);
            }
          }
        } catch (err) {
          console.log("Impossible de charger les candidatures ou aucune candidature disponible:", err);
          setCandidatures([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement de l'offre:", err);
        setError("Impossible de charger les détails de l'offre");
        setLoading(false);
      }
    };

    if (id) {
      loadOfferAndCandidatures();
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

  // Fonction pour supprimer l'offre
  const handleDeleteOffer = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await deleteOffer(id);
        alert('✅ Offre supprimée avec succès');
        navigate('/clinique-offres');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error);
        alert('❌ Erreur lors de la suppression de l\'offre');
      }
    }
  };

  // Fonction pour gérer les candidatures
  const handleManageCandidates = () => {
    // Correction : Utiliser la route qui correspond au composant OfferCandidates
    navigate(`/candidats/${id}`);  };

  if (loading) {
    return (
      <div className="clinique-offre-container">
        <div className="dashboard-header">
          <h1>Détails de l'offre</h1>
        </div>
        <div className="loading">
          <p>Chargement des détails de l'offre...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="clinique-offre-container">
        <div className="dashboard-header">
          <h1>Détails de l'offre</h1>
        </div>
        <div className="error-container">
          <p>{error || "Cette offre n'existe pas ou a été supprimée."}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/clinique-offres')}
          >
            <i className="fa-solid fa-arrow-left"></i> Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  // Calculer les statistiques des candidatures
  const nbCandidatures = candidatures.length;
  const nbCandidaturesPending = candidatures.filter(c => c.statut === 'pending' || c.statut === 'en_attente').length;
  const nbCandidaturesAccepted = candidatures.filter(c => c.statut === 'acceptee' || c.statut === 'accepted').length;
  const nbCandidaturesRejected = candidatures.filter(c => c.statut === 'refusee' || c.statut === 'rejected').length;

  // Vérifier si une candidature est acceptée
  const hasCandidatureAccepted = nbCandidaturesAccepted > 0;

  return (
    <div className="clinique-offre-container">
      <div className="dashboard-header sticky-header">
        <h1>Détails de l'offre</h1>
        <button 
          className="back-button"
          onClick={() => navigate('/clinique-offres')}
        >
          <i className="fa-solid fa-arrow-left"></i> Retour aux offres
        </button>
      </div>
      
      <div className="offer-detail-wrapper">
        <div className="offer-detail-card">
          <div className="offer-detail-header">
            <h2>{offer.titre}</h2>
            <span className={`status-badge ${offer.statut || 'pending'}`}>
              {offer.statut === 'active' ? 'Active' : 
               offer.statut === 'archivée' ? 'Archivée' : 
               offer.statut === 'expired' ? 'Expirée' : 'En attente'}
            </span>
          </div>
          
          <div className="offer-detail-section">
            <h3>Informations générales</h3>
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Profession:</span>
                <span className="detail-value">
                  {offer.type_professionnel === 'dentiste' ? 'Dentiste' : 
                   offer.type_professionnel === 'assistant' ? 'Assistant(e) dentaire' : 
                   'Hygiéniste dentaire'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date de publication:</span>
                <span className="detail-value">
                  {offer.date_publication ? new Date(offer.date_publication).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                </span>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Période:</span>
                <span className="detail-value">
                  {formatDateRange(offer.date_debut, offer.date_fin)}
                </span>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Horaires:</span>
                <span className="detail-value">
                  {formatTime(offer.heure_debut)} à {formatTime(offer.heure_fin)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rémunération:</span>
                <span className="detail-value">
                  {offer.remuneration ? `${offer.remuneration}€` : 'Non spécifiée'}
                </span>
              </div>
            </div>

            {offer.adresse_complete && (
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Adresse:</span>
                  <span className="detail-value">
                    {offer.adresse_complete}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="offer-detail-section">
            <h3>Description</h3>
            <p>{offer.descript || 'Aucune description fournie.'}</p>
          </div>
          
          {offer.competences_requises && (
            <div className="offer-detail-section">
              <h3>Compétences requises</h3>
              <p>{offer.competences_requises}</p>
            </div>
          )}
          
          {offer.est_urgent === 'Y' && (
            <div className="offer-detail-section urgent-notice">
              <h3><i className="fa-solid fa-exclamation-triangle"></i> Mission urgente</h3>
              <p>Cette offre requiert une réponse rapide.</p>
            </div>
          )}
          
          {/* Section des candidatures */}
          <div className="offer-detail-section candidatures-section">
            <h3>
              <i className="fa-solid fa-users"></i> Candidatures
              {nbCandidatures > 0 && <span className="candidature-count">({nbCandidatures})</span>}
            </h3>
            
            {nbCandidatures > 0 ? (
              <>
                <div className="candidatures-stats">
                  <div className="candidature-stat">
                    <span className="stat-value">{nbCandidatures}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  {nbCandidaturesPending > 0 && (
                    <div className="candidature-stat pending">
                      <span className="stat-value">{nbCandidaturesPending}</span>
                      <span className="stat-label">En attente</span>
                    </div>
                  )}
                  {nbCandidaturesAccepted > 0 && (
                    <div className="candidature-stat accepted">
                      <span className="stat-value">{nbCandidaturesAccepted}</span>
                      <span className="stat-label">Acceptée(s)</span>
                    </div>
                  )}
                  {nbCandidaturesRejected > 0 && (
                    <div className="candidature-stat rejected">
                      <span className="stat-value">{nbCandidaturesRejected}</span>
                      <span className="stat-label">Refusée(s)</span>
                    </div>
                  )}
                </div>
                
                {hasCandidatureAccepted && (
                  <div className="candidature-status-banner accepted">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Une candidature a été acceptée pour ce poste</span>
                  </div>
                )}
                
                <button 
                  className="view-candidatures-button"
                  onClick={handleManageCandidates}
                >
                  <i className="fa-solid fa-user-check"></i> Gérer les candidatures
                </button>
              </>
            ) : (
              <div className="no-candidatures">
                <p>
                  <i className="fa-solid fa-info-circle"></i> Aucune candidature n'a encore été reçue pour cette offre.
                </p>
              </div>
            )}
          </div>
          
          <div className="offer-detail-actions">
            <button 
              className="edit-button"
              onClick={() => navigate(`/clinique-cree/${id}`)}
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
    </div>
  );
};

export default CliniqueOffreDetail;