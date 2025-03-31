import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/Principale.css';

const Principale = () => {
  const navigate = useNavigate();
  const { offers, loading, error, fetchOffers, candidates } = useOffers();
  
  // États pour les données
  const [stats, setStats] = useState({
    applicationsEnvoyees: 0,
    entretiensPrevus: 0,
    offresDisponibles: 0,
    offresConsultees: 0
  });
  
  const [offresTendance, setOffresTendance] = useState([]);
  const [entretiensAVenir, setEntretiensAVenir] = useState([]);
  const [messagesRecents, setMessagesRecents] = useState([]);
  const [offresEnAttente, setOffresEnAttente] = useState([]);
  
  // Chargement des données
  useEffect(() => {
    // Charger les offres depuis le contexte
    fetchOffers();
    
    // Charger les autres données simulées
    setStats({
      applicationsEnvoyees: 12,
      entretiensPrevus: 3,
      offresDisponibles: offers ? offers.length : 0,
      offresConsultees: 27
    });
    
    // Simuler les entretiens à venir
    setEntretiensAVenir([
      {
        id: 1,
        clinique: 'Cabinet Elite Dental',
        poste: 'Hygiéniste dentaire',
        date: '2023-06-15',
        heure: '14:00',
        type: 'video'
      },
      {
        id: 2,
        clinique: 'Centre Dentaire Express',
        poste: 'Assistant(e) dentaire',
        date: '2023-06-18',
        heure: '10:30',
        type: 'présentiel'
      }
    ]);
    
    // Messages récents (simulés)
    setMessagesRecents([
      {
        id: 1,
        expediteur: 'Clinique Dentaire Sourire',
        avatar: 'S',
        contenu: 'Bonjour, suite à votre candidature pour le poste de dentiste remplaçant, nous aimerions planifier un entretien...',
        nonLu: true,
        date: '2023-06-10T14:30:00',
        conversationId: 1
      },
      {
        id: 2,
        expediteur: 'Cabinet Elite Dental',
        avatar: 'E',
        contenu: 'Nous avons bien reçu vos disponibilités. Seriez-vous libre pour un appel téléphonique demain à 15h?',
        nonLu: true,
        date: '2023-06-09T10:15:00',
        conversationId: 2
      },
      {
        id: 3,
        expediteur: 'Centre Dentaire Express',
        avatar: 'C',
        contenu: 'Merci pour votre candidature. Votre profil a retenu notre attention et nous souhaiterions vous rencontrer...',
        nonLu: false,
        date: '2023-06-08T16:45:00',
        conversationId: 3
      }
    ]);
  }, []);

  // Mettre à jour les offres en tendance quand les offres sont chargées
  useEffect(() => {
    if (offers && offers.length > 0) {
      // Filtrer les 3 offres les plus récentes en statut actif
      const actives = offers.filter(offer => offer.status === 'active');
      const tendances = actives.slice(0, 3).map((offer, index) => ({
        id: offer.id,
        titre: offer.title,
        clinique: offer.cliniqueName,
        lieu: offer.location,
        dateDébut: offer.startDate,
        dateFin: offer.endDate,
        salaire: offer.compensation,
        datePublication: offer.datePosted,
        // Alterner entre les statuts pour les offres en tendance
        status: index === 0 ? 'nouveau' : index === 1 ? 'populaire' : 'vedette'
      }));
      
      setOffresTendance(tendances);
      
      // Mettre à jour les statistiques
      setStats(prev => ({
        ...prev,
        offresDisponibles: offers.filter(o => o.status === 'active').length
      }));
      
      // Simuler les offres en attente basées sur les candidatures réelles
      if (candidates && candidates.length > 0) {
        const candidaturesEnAttente = candidates
          .filter(c => c.status !== 'rejected')
          .slice(0, 3)
          .map(c => {
            const relatedOffer = offers.find(o => o.id === c.offerId);
            return {
              id: c.id,
              titre: relatedOffer ? relatedOffer.title : 'Offre non disponible',
              clinique: relatedOffer ? relatedOffer.cliniqueName : 'Clinique inconnue',
              dateCandidature: c.applicationDate,
              statut: c.status === 'selected' ? 'Entretien prévu' : c.status === 'pending' ? 'En cours d\'examen' : 'Candidature reçue'
            };
          });
          
        setOffresEnAttente(candidaturesEnAttente);
      }
    }
  }, [offers, candidates]);

  // Formatage de date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-CA', options);
  };

  // Navigation
  const navigateTo = (path) => {
    navigate(path);
  };
  
  // Formatage de l'heure pour les messages
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Si le message date d'aujourd'hui, afficher l'heure
    if (date.toDateString() === today.toDateString()) {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Sinon, afficher la date au format court
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  return (
    <div className="principale-container">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p className="welcome-message">Bienvenue sur votre espace professionnel</p>
      </div>

      {/* Cartes des statistiques */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.applicationsEnvoyees}</h3>
            <p>Candidatures envoyées</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretiensPrevus}</h3>
            <p>Entretiens prévus</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-briefcase"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.offresDisponibles}</h3>
            <p>Offres disponibles</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-eye"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.offresConsultees}</h3>
            <p>Offres consultées</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-row">
        {/* Section des offres en tendance */}
        <div className="dashboard-section offres-section">
          <div className="section-header">
            <h2>Offres en tendance</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/offres')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            <div className="scrollable-content">
              <div className="offres-tendance">
                {loading ? (
                  <p>Chargement des offres...</p>
                ) : error ? (
                  <p>Erreur lors du chargement des offres</p>
                ) : offresTendance.length > 0 ? (
                  offresTendance.map(offre => (
                    <div key={offre.id} className={`offre-card ${offre.status}`}>
                      <div className="offre-header">
                        <h3>{offre.titre}</h3>
                        {offre.status === 'nouveau' && (
                          <span className="status-badge nouveau">Nouveau</span>
                        )}
                        {offre.status === 'populaire' && (
                          <span className="status-badge populaire">Populaire</span>
                        )}
                        {offre.status === 'vedette' && (
                          <span className="status-badge vedette">Vedette</span>
                        )}
                      </div>
                      <div className="offre-info">
                        <p className="offre-clinique">
                          <i className="fa-solid fa-hospital"></i> {offre.clinique}
                        </p>
                        <p className="offre-lieu">
                          <i className="fa-solid fa-location-dot"></i> {offre.lieu}
                        </p>
                        <p className="offre-date">
                          <i className="fa-solid fa-calendar"></i> Du {formatDate(offre.dateDébut)} au {formatDate(offre.dateFin)}
                        </p>
                        <p className="offre-salaire">
                          <i className="fa-solid fa-money-bill-wave"></i> {offre.salaire}
                        </p>
                      </div>
                      <div className="offre-actions">
                        <button 
                          className="view-details-button"
                          onClick={() => navigateTo(`/offres/${offre.id}`)}
                        >
                          <i className="fa-solid fa-eye"></i> Détails
                        </button>
                        <button className="save-button">
                          <i className="fa-regular fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucune offre disponible pour le moment</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Section des entretiens à venir */}
        <div className="dashboard-section entretiens-section">
          <div className="section-header">
            <h2>Entretiens à venir</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/calendrier')}
            >
              Calendrier
            </button>
          </div>
          
          <div className="section-content">
            {entretiensAVenir.length > 0 ? (
              <div className="scrollable-content">
                <div className="entretiens-liste">
                  {entretiensAVenir.map(entretien => (
                    <div key={entretien.id} className="entretien-card">
                      <div className="entretien-date">
                        <span className="day">{new Date(entretien.date).getDate()}</span>
                        <span className="month">{new Date(entretien.date).toLocaleDateString('fr-CA', { month: 'short' })}</span>
                      </div>
                      <div className="entretien-details">
                        <h3>{entretien.clinique}</h3>
                        <p className="entretien-poste">
                          <i className="fa-solid fa-user-tie"></i> {entretien.poste}
                        </p>
                        <p className="entretien-time">
                          <i className="fa-regular fa-clock"></i> {entretien.heure}
                        </p>
                        <p className="entretien-type">
                          {entretien.type === 'video' ? (
                            <><i className="fa-solid fa-video"></i> Entretien vidéo</>
                          ) : entretien.type === 'téléphone' ? (
                            <><i className="fa-solid fa-phone"></i> Appel téléphonique</>
                          ) : (
                            <><i className="fa-solid fa-building"></i> Entretien en personne</>
                          )}
                        </p>
                      </div>
                      <div className="entretien-actions">
                        <button className="preparer-button">
                          <i className="fa-solid fa-clipboard-check"></i> Préparer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Vous n'avez pas d'entretiens prévus pour le moment.</p>
                <button 
                  className="explore-button"
                  onClick={() => navigateTo('/offres')}
                >
                  <i className="fa-solid fa-search"></i> Explorer les offres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-secondary-row">
        {/* Section des messages récents */}
        <div className="dashboard-section messages-section">
          <div className="section-header">
            <h2>Messages récents</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/messagerie')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            <div className="scrollable-content">
              <div className="messages-liste">
                {messagesRecents.map(message => (
                  <div 
                    key={message.id} 
                    className={`message-card ${message.nonLu ? 'non-lu' : ''}`}
                    onClick={() => navigateTo(`/messagerie/${message.conversationId}`)}
                  >
                    <div className="message-avatar">{message.avatar}</div>
                    <div className="message-content">
                      <div className="message-header">
                        <h3>{message.expediteur}</h3>
                        <span className="message-time">{formatMessageTime(message.date)}</span>
                      </div>
                      <p>{message.contenu.length > 60 ? message.contenu.substring(0, 60) + '...' : message.contenu}</p>
                    </div>
                    {message.nonLu && <div className="non-lu-badge"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Section des candidatures en attente */}
        <div className="dashboard-section candidatures-section">
          <div className="section-header">
            <h2>Mes candidatures</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/applique')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            <div className="scrollable-content">
              <div className="candidatures-liste">
                {offresEnAttente.map(offre => (
                  <div key={offre.id} className="candidature-card">
                    <div className="candidature-info">
                      <h3>{offre.titre}</h3>
                      <p className="candidature-clinique">
                        <i className="fa-solid fa-hospital"></i> {offre.clinique}
                      </p>
                      <p className="candidature-date">
                        <i className="fa-solid fa-calendar-check"></i> Postuler le {formatDate(offre.dateCandidature)}
                      </p>
                    </div>
                    <div className="candidature-status">
                      <span className={`status-badge ${offre.statut === 'Entretien prévu' ? 'success' : offre.statut === 'En cours d\'examen' ? 'warning' : 'info'}`}>
                        {offre.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="quick-action-buttons">
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/offres')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <span>Explorer les offres</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/applique')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <span>Mes candidatures</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/calendrier')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-calendar-alt"></i>
            </div>
            <span>Calendrier</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/messagerie')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-comment-dots"></i>
            </div>
            <span>Messagerie</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Principale;