import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOfferById, updateOffer } from '../lib/offerApi';
import { fetchCandidaturesByOffre, accepterCandidature, refuserCandidature } from '../lib/candidatureApi';
import '../styles/OfferCandidates.css';

const OfferCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [candidateToReject, setCandidateToReject] = useState(null);

  // Charger l'offre et ses candidatures
  useEffect(() => {
    const loadOfferAndCandidatures = async () => {
      try {
        setLoading(true);
        console.log("🔍 Chargement de l'offre avec ID:", id);
        
        // 1. Charger les détails de l'offre
        const offerData = await fetchOfferById(id);
        console.log("✅ Offre chargée:", offerData);
        setOffer(offerData);
        
        // 2. Charger les candidatures pour cette offre
        try {
          console.log("🔍 Chargement des candidatures pour l'offre:", id);
          const candidaturesData = await fetchCandidaturesByOffre(id);
          
          console.log("📊 Réponse des candidatures:", candidaturesData);
          
          // Vérifier si la réponse est un tableau
          if (Array.isArray(candidaturesData)) {
            setCandidatures(candidaturesData);
            console.log(`✅ ${candidaturesData.length} candidatures chargées`);
            
            // Si l'offre est en attente et qu'il y a des candidatures, la passer en active
            if (offerData.statut === 'pending' && candidaturesData.length > 0) {
              try {
                console.log("🔄 Mise à jour du statut de l'offre: pending -> active");
                const updatedOffer = { ...offerData, statut: 'active' };
                await updateOffer(id, updatedOffer);
                setOffer(updatedOffer);
                console.log("✅ Statut de l'offre mis à jour avec succès");
              } catch (updateErr) {
                console.error("❌ Erreur lors de la mise à jour du statut de l'offre:", updateErr);
              }
            }
          } else {
            console.error("❌ La réponse API n'est pas un tableau:", candidaturesData);
            setCandidatures([]);
            setError("Format de données inattendu pour les candidatures");
          }
          
        } catch (err) {
          console.error("❌ Erreur lors du chargement des candidatures:", err);
          setError(`Erreur lors du chargement des candidatures: ${err.message}`);
          setCandidatures([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("❌ Erreur lors du chargement de l'offre:", err);
        setError(`Impossible de charger les détails de l'offre: ${err.message}`);
        setLoading(false);
      }
    };

    if (id) {
      loadOfferAndCandidatures();
    }
  }, [id]);

  // Gérer la sélection d'un candidat pour acceptation
  const handleSelectCandidate = (candidature) => {
    setSelectedCandidate(candidature);
    setConfirmationVisible(true);
  };

  // Gérer la sélection d'un candidat pour refus
  const handleRejectCandidate = (candidature) => {
    setCandidateToReject(candidature);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  // Naviguer vers le profil du candidat
  const navigateToProfile = (professionnel) => {
    if (professionnel?.id_professionnel) {
      navigate(`/profil-professionnel/${professionnel.id_professionnel}`);
    }
  };

  // Accepter une candidature
  const acceptCandidate = async () => {
    if (!selectedCandidate) return;
    
    try {
      setLoading(true);
      console.log("🔍 Acceptation de la candidature:", selectedCandidate.id_candidature);
      
      await accepterCandidature(selectedCandidate.id_candidature);
      
      // Mettre à jour l'interface utilisateur
      setCandidatures(prevCandidatures => 
        prevCandidatures.map(c => {
          if (c.id_candidature === selectedCandidate.id_candidature) {
            return { ...c, statut: 'acceptee' };
          }
          return c;
        })
      );
      
      // Mettre à jour le statut de l'offre à "active" s'il ne l'est pas déjà
      if (offer.statut !== 'active') {
        const updatedOffer = {
          ...offer,
          statut: 'active'
        };
        
        try {
          await updateOffer(offer.id_offre, updatedOffer);
          setOffer(updatedOffer);
        } catch (updateErr) {
          console.error("❌ Erreur lors de la mise à jour du statut de l'offre:", updateErr);
        }
      }
      
      setConfirmationVisible(false);
      setLoading(false);
      
      alert("✅ Candidature acceptée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de l'acceptation de la candidature:", error);
      setLoading(false);
      alert(`❌ Erreur lors de l'acceptation de la candidature: ${error.message}`);
    }
  };

  // Refuser une candidature
  const rejectCandidate = async () => {
    if (!candidateToReject) return;
    
    try {
      setLoading(true);
      console.log("🔍 Refus de la candidature:", candidateToReject.id_candidature);
      
      await refuserCandidature(
        candidateToReject.id_candidature,
        rejectReason || "Votre candidature n'a malheureusement pas été retenue."
      );
      
      // Mettre à jour l'interface utilisateur
      setCandidatures(prevCandidatures => 
        prevCandidatures.map(c => {
          if (c.id_candidature === candidateToReject.id_candidature) {
            return { ...c, statut: 'refusee', message_reponse: rejectReason };
          }
          return c;
        })
      );
      
      setRejectModalVisible(false);
      setCandidateToReject(null);
      setLoading(false);
      
      alert("✅ Candidature refusée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors du refus de la candidature:", error);
      setLoading(false);
      alert(`❌ Erreur lors du refus de la candidature: ${error.message}`);
    }
  };

  // Annuler une action
  const cancelAction = () => {
    setSelectedCandidate(null);
    setConfirmationVisible(false);
    setCandidateToReject(null);
    setRejectModalVisible(false);
  };

  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formatter le statut d'une candidature
  const formatStatus = (status) => {
    switch (status) {
      case 'acceptee':
      case 'accepted':
        return 'Acceptée';
      case 'refusee':
      case 'rejected':
        return 'Refusée';
      case 'pending':
      case 'en_attente':
        return 'En attente';
      default:
        return 'En attente';
    }
  };

  // Obtenir l'URL de la photo de profil
  const getPhotoUrl = (photoFilename) => {
    if (!photoFilename) return '/img/default-avatar.png';
    return `/uploads/photos/${photoFilename}`;
  };

  // Forcer un rechargement des candidatures
// Forcer un rechargement des candidatures
const handleReloadCandidatures = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const candidaturesData = await fetchCandidaturesByOffre(id);
    console.log("📊 Rechargement des candidatures:", candidaturesData);
    
    if (Array.isArray(candidaturesData)) {
      setCandidatures(candidaturesData);
      alert(`✅ ${candidaturesData.length} candidatures chargées`);
    } else {
      setCandidatures([]);
      setError("Format de données inattendu");
    }
    
    setLoading(false);
  } catch (err) {
    console.error("❌ Erreur lors du rechargement:", err);
    setError(`Échec du rechargement: ${err.message}`);
    setLoading(false);
  }
};

  if (loading && !offer) {
    return (
      <div className="candidatures-container">
        <div className="dashboard-header">
          <h1>Gestion des candidatures</h1>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="candidatures-container">
        <div className="dashboard-header">
          <h1>Gestion des candidatures</h1>
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

  // Vérifier s'il y a une candidature acceptée
  const acceptedCandidature = candidatures.find(c => 
    c.statut === 'acceptee' || c.statut === 'accepted'
  );

  return (
    <div className="candidatures-container">
      <div className="dashboard-header">
        <h1>Gestion des candidatures</h1>
        <button 
          className="back-button"
          onClick={() => navigate(`/clinique-offres/${id}`)}
        >
          <i className="fa-solid fa-arrow-left"></i> Retour à l'offre
        </button>
      </div>

      <div className="offer-summary">
        <h2>{offer.titre}</h2>
        <div className="offer-brief">
          <span className="offer-dates">
            <i className="fa-solid fa-calendar"></i> 
            {offer.date_debut === offer.date_fin 
              ? `Le ${formatDate(offer.date_debut)}` 
              : `Du ${formatDate(offer.date_debut)} au ${formatDate(offer.date_fin)}`}
          </span>
          <span className="offer-time">
            <i className="fa-regular fa-clock"></i> 
            {offer.heure_debut?.substring(0, 5)} - {offer.heure_fin?.substring(0, 5)}
          </span>
          <span className={`status-badge ${offer.statut}`}>
            {offer.statut === 'active' ? 'Active' : 
             offer.statut === 'pending' ? 'En attente' : 
             offer.statut === 'archived' ? 'Archivée' : 'Expirée'}
          </span>
        </div>
        
        {acceptedCandidature && (
          <div className="accepted-candidate-banner">
            <i className="fa-solid fa-check-circle"></i>
            <span>
              Une candidature a été acceptée pour ce poste
              {acceptedCandidature.ProfessionnelDentaire?.nom_complet && 
               ` (${acceptedCandidature.ProfessionnelDentaire.nom_complet})`}
            </span>
          </div>
        )}
      </div>

      <div className="candidatures-section">
        <div className="candidatures-header">
          <h3>
            <i className="fa-solid fa-users"></i> 
            Candidats ({candidatures.length})
          </h3>
          <button 
            className="reload-button"
            onClick={handleReloadCandidatures}
            disabled={loading}
          >
            <i className="fa-solid fa-sync"></i> Recharger
          </button>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <div className="loading-spinner-small"></div>
            <p>Chargement en cours...</p>
          </div>
        )}
        
        {!loading && candidatures.length === 0 ? (
          <div className="no-candidatures">
            <p>Aucune candidature n'a été reçue pour cette offre.</p>
            <p className="help-text">
              Si vous pensez qu'il s'agit d'une erreur, essayez de recharger les candidatures 
              ou vérifiez que votre offre est bien visible aux professionnels.
            </p>
            <button 
              className="back-button"
              onClick={() => navigate(`/clinique-offres/${id}`)}
            >
              Retour à l'offre
            </button>
          </div>
        ) : (
          <div className="candidatures-list">
            {candidatures.map(candidature => (
              <div 
                key={candidature.id_candidature} 
                className={`candidature-card ${candidature.statut}`}
              >
                <div className="candidature-header">
                  <div className="candidature-profile">
                    <div 
                      className="profile-photo-container"
                      onClick={() => navigateToProfile(candidature.ProfessionnelDentaire)}
                      title="Cliquez pour voir le profil complet"
                    >
                      <img 
                        src={getPhotoUrl(candidature.ProfessionnelDentaire?.User?.photo_profil)} 
                        alt={candidature.ProfessionnelDentaire?.nom_complet || "Candidat"} 
                        className="profile-photo"
                      />
                    </div>
                    <h4>
                      {candidature.ProfessionnelDentaire?.nom_complet || 
                       `${candidature.ProfessionnelDentaire?.User?.prenom || ''} ${candidature.ProfessionnelDentaire?.User?.nom || ''}` || 
                       "Candidat"}
                    </h4>
                  </div>
                  <span className={`candidature-status ${candidature.statut}`}>
                    {formatStatus(candidature.statut)}
                  </span>
                </div>
                
                <div className="candidature-details">
                  {candidature.ProfessionnelDentaire?.type_profession && (
                    <p>
                      <strong>Profession:</strong> {
                        candidature.ProfessionnelDentaire.type_profession === 'dentiste' ? 'Dentiste' : 
                        candidature.ProfessionnelDentaire.type_profession === 'assistant' ? 'Assistant(e) dentaire' : 
                        'Hygiéniste dentaire'
                      }
                    </p>
                  )}
                  
                  {(candidature.ProfessionnelDentaire?.User?.courriel || candidature.ProfessionnelDentaire?.email) && (
                    <p><strong>Email:</strong> {candidature.ProfessionnelDentaire?.User?.courriel || candidature.ProfessionnelDentaire?.email}</p>
                  )}
                  
                  {(candidature.ProfessionnelDentaire?.User?.telephone || candidature.ProfessionnelDentaire?.telephone) && (
                    <p><strong>Téléphone:</strong> {candidature.ProfessionnelDentaire?.User?.telephone || candidature.ProfessionnelDentaire?.telephone}</p>
                  )}
                  
                  {candidature.ProfessionnelDentaire?.annees_experience && (
                    <p><strong>Expérience:</strong> {candidature.ProfessionnelDentaire.annees_experience} ans</p>
                  )}
                  
                  <p><strong>Candidature reçue le:</strong> {formatDate(candidature.date_candidature)}</p>
                  
                  {candidature.message_personnalise && (
                    <div className="candidature-message">
                      <strong>Message du candidat:</strong>
                      <p>{candidature.message_personnalise}</p>
                    </div>
                  )}
                  
                  {candidature.statut === 'refusee' && candidature.message_reponse && (
                    <div className="candidature-response">
                      <strong>Motif de refus:</strong>
                      <p>{candidature.message_reponse}</p>
                    </div>
                  )}
                </div>
                
                <div className="candidature-actions">
                  {candidature.statut === 'acceptee' || candidature.statut === 'accepted' ? (
                    <div className="candidate-selected">
                      <i className="fa-solid fa-check-circle"></i> Candidature acceptée
                    </div>
                  ) : candidature.statut === 'refusee' || candidature.statut === 'rejected' ? (
                    <div className="candidate-rejected">
                      <i className="fa-solid fa-times-circle"></i> Candidature refusée
                    </div>
                  ) : (
                    <div className="candidate-actions-buttons">
                      <button 
                        className="accept-button"
                        onClick={() => handleSelectCandidate(candidature)}
                      >
                        <i className="fa-solid fa-check"></i> Accepter
                      </button>
                      <button 
                        className="reject-button"
                        onClick={() => handleRejectCandidate(candidature)}
                      >
                        <i className="fa-solid fa-times"></i> Refuser
                      </button>
                    </div>
                  )}
                  
                  {/* Bouton pour voir le profil complet du candidat */}
                  {candidature.ProfessionnelDentaire?.id_professionnel && (
                    <button 
                      className="view-profile-button"
                      onClick={() => navigateToProfile(candidature.ProfessionnelDentaire)}
                    >
                      <i className="fa-solid fa-id-card"></i> Voir profil
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de confirmation pour accepter un candidat */}
      {confirmationVisible && selectedCandidate && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirmer la sélection</h3>
              <button className="close-button" onClick={cancelAction}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <p>
                Vous êtes sur le point d'accepter la candidature de 
                <strong> {selectedCandidate.ProfessionnelDentaire?.nom_complet || 'ce candidat'}</strong>.
              </p>
              
              {acceptedCandidature && (
                <div className="warning-message">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  <p>
                    Attention: Une candidature a déjà été acceptée pour ce poste. 
                    Si vous continuez, cette ancienne sélection sera remplacée.
                  </p>
                </div>
              )}
              
              <p>Cette action :</p>
              <ul>
                <li>Confirmera la candidature de ce professionnel</li>
                <li>Enverra une notification au candidat</li>
                <li>Changera le statut de l'offre à "Active"</li>
              </ul>
              
              <p>Êtes-vous sûr de vouloir continuer ?</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelAction}
              >
                Annuler
              </button>
              <button 
                className="confirm-button"
                onClick={acceptCandidate}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour refuser un candidat avec message */}
      {rejectModalVisible && candidateToReject && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <div className="modal-header">
              <h3>Refuser la candidature</h3>
              <button className="close-button" onClick={cancelAction}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <p>
                Vous êtes sur le point de refuser la candidature de 
                <strong> {candidateToReject.ProfessionnelDentaire?.nom_complet || 'ce candidat'}</strong>.
              </p>
              
              <div className="form-group">
                <label htmlFor="rejectReason">Motif du refus (optionnel) :</label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous refusez cette candidature..."
                  rows="4"
                ></textarea>
                <small>Ce message sera envoyé au candidat.</small>
              </div>
              
              <p>Cette action est définitive. Voulez-vous continuer ?</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelAction}
              >
                Annuler
              </button>
              <button 
                className="confirm-button reject"
                onClick={rejectCandidate}
              >
                Refuser la candidature
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay de chargement */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default OfferCandidates;