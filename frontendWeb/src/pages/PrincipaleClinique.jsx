import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOffersForClinic } from '../lib/offerApi';
import { fetchClinicProfile } from '../lib/clinicApi';
import { apiFetch } from '../lib/apiFetch';
import '../styles/PrincipaleClinique.css';

const PrincipaleClinique = () => {
  const navigate = useNavigate();
  
  // États pour stocker les données
  const [clinique, setClinique] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]); // Pour les messages (à charger depuis l'API)
  const [meetings, setMeetings] = useState([]); // Pour les rendez-vous (à charger depuis l'API)
  const [stats, setStats] = useState({
    activeOffers: 0,
    pendingOffers: 0,
    totalApplications: 0,
    pendingMeetings: 0
  });

  // Charger les données au premier rendu
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Charger le profil de la clinique
        const profileData = await fetchClinicProfile();
        setClinique(profileData);
        
        // 2. Charger les offres de la clinique
        const offersData = await fetchOffersForClinic();
        setOffers(offersData);
        
        // 3. Essayer de charger les messages (si l'endpoint existe)
        try {
          const messagesData = await apiFetch('/messages');
          setMessages(messagesData);
        } catch (err) {
          console.log("Messages API non disponible ou erreur:", err);
          // Utiliser des données temporaires pour la démonstration
          setMessages([
            {
              id: 1,
              sender: 'Dr. Leslie Labrecque',
              avatar: 'D',
              avatarType: 'dentiste',
              content: 'Bonjour, je suis intéressée par votre offre de remplacement pour l\'été...',
              unread: true,
              conversationId: 1
            },
            {
              id: 2,
              sender: 'Thomas Simard',
              avatar: 'T',
              avatarType: 'assistant',
              content: 'Merci pour les informations. Je voudrais savoir si le poste peut évoluer...',
              unread: false,
              conversationId: 2
            }
          ]);
        }
        
        // 4. Essayer de charger les rendez-vous (si l'endpoint existe)
        try {
          const meetingsData = await apiFetch('/meetings');
          setMeetings(meetingsData);
        } catch (err) {
          console.log("Meetings API non disponible ou erreur:", err);
          // Utiliser des données temporaires pour la démonstration
          setMeetings([]);
        }
        
        // Calculer les statistiques
        if (offersData) {
          const activeOffers = offersData.filter(offer => offer.statut === 'active').length;
          const pendingOffers = offersData.filter(offer => offer.statut === 'pending').length;
          
          // Pour les candidatures, nous devons vérifier si l'information est disponible
          let totalApplications = 0;
          try {
            // Si les offres contiennent des informations sur les candidatures
            totalApplications = offersData.reduce((total, offer) => {
              // Si l'offre a une propriété candidatures, c'est probablement un array
              if (offer.candidatures && Array.isArray(offer.candidatures)) {
                return total + offer.candidatures.length;
              }
              // Si l'offre a une propriété nb_candidatures, c'est probablement un nombre
              else if (offer.nb_candidatures) {
                return total + offer.nb_candidatures;
              }
              return total;
            }, 0);
          } catch (err) {
            console.log("Impossible de calculer le nombre total de candidatures:", err);
          }
          
          setStats({
            activeOffers,
            pendingOffers,
            totalApplications,
            pendingMeetings: meetings.length
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error);
        setError("Une erreur est survenue lors du chargement des données.");
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Navigation vers les différentes sections
  const navigateTo = (path) => {
    navigate(path);
  };

  // Navigation vers une conversation spécifique
  const goToConversation = (conversationId) => {
    navigate(`/clinique-messagerie/${conversationId}`);
  };

  // Formater la date en français
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  // Récupérer les offres récentes (triées par date de publication)
  const recentOffers = [...offers].sort((a, b) => {
    const dateA = a.date_publication ? new Date(a.date_publication) : new Date(0);
    const dateB = b.date_publication ? new Date(b.date_publication) : new Date(0);
    return dateB - dateA;
  }).slice(0, 3); // Limiter à 3 offres récentes
  
  // Filtrer les rendez-vous à venir
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3); // Limiter à 3 rendez-vous

  return (
    <div className="principale-clinique-container">
      <div className="dashboard-header">
        <h1>Tableau de bord - Clinique</h1>
        <p className="welcome-message">Bienvenue, {clinique?.nom || 'dans votre espace clinique'}</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-clipboard-list"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeOffers}</h3>
            <p>Offres actives</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingOffers}</h3>
            <p>Offres en attente</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-user-group"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalApplications}</h3>
            <p>Candidatures reçues</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingMeetings}</h3>
            <p>Rendez-vous à venir</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-row">
        <div className="dashboard-section offers-section">
          <div className="section-header">
            <h2>Mes offres de remplacement</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/clinique-offres')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            {recentOffers.length > 0 ? (
              <div className="scrollable-content">
                <div className="recent-offers">
                  {recentOffers.map(offer => (
                    <div key={offer.id_offre} className={`recent-offer-card ${offer.statut}`}>
                      <div className="offer-card-header">
                        <h3>{offer.titre || "Offre sans titre"}</h3>
                        <span className={`status-badge ${offer.statut}`}>
                          {offer.statut === 'active' ? 'Active' : 
                          offer.statut === 'pending' ? 'En attente' : 'Expirée'}
                        </span>
                      </div>
                      <p className="offer-date">Publiée le {formatDate(offer.date_publication)}</p>
                      <p className="offer-period">Du {formatDate(offer.date_debut)} au {formatDate(offer.date_fin)}</p>
                      <p className="offer-applications">
                        <i className="fa-solid fa-user-group"></i> {offer.nb_candidatures || 0} candidature(s)
                      </p>
                      <button 
                        className="view-details-button"
                        onClick={() => navigateTo(`/clinique-offres/${offer.id_offre}`)}
                      >
                        <i className="fa-solid fa-eye"></i> Détails
                      </button>
                    </div>
                  ))}
                </div>
                
                {recentOffers.length > 0 && (
                  <div className="section-actions">
                    <button 
                      className="primary-button"
                      onClick={() => navigateTo('/clinique-cree')}
                    >
                      <i className="fa-solid fa-plus"></i> Nouvelle offre
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <p>Vous n'avez pas encore d'offres de remplacement.</p>
                <button 
                  className="create-button"
                  onClick={() => navigateTo('/clinique-cree')}
                >
                  <i className="fa-solid fa-plus"></i> Créer une offre
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-section calendar-section">
          <div className="section-header">
            <h2>Rendez-vous à venir</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/clinique-calendrier')}
            >
              Calendrier
            </button>
          </div>
          
          <div className="section-content">
            {upcomingMeetings.length > 0 ? (
              <div className="scrollable-content">
                <div className="upcoming-meetings">
                  {upcomingMeetings.map(meeting => (
                    <div key={meeting.id} className="meeting-card">
                      <div className="meeting-date">
                        <span className="day">{new Date(meeting.date).getDate()}</span>
                        <span className="month">{new Date(meeting.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      </div>
                      <div className="meeting-details">
                        <h3>{meeting.title}</h3>
                        <p className="meeting-time">
                          <i className="fa-regular fa-clock"></i> {meeting.startTime} - {meeting.endTime}
                        </p>
                        <p className="meeting-candidate">
                          <i className="fa-regular fa-user"></i> {meeting.candidatName}
                        </p>
                        <p className="meeting-type">
                          {meeting.meetingType === 'video' ? (
                            <><i className="fa-solid fa-video"></i> Vidéoconférence</>
                          ) : meeting.meetingType === 'phone' ? (
                            <><i className="fa-solid fa-phone"></i> Appel téléphonique</>
                          ) : (
                            <><i className="fa-solid fa-user"></i> En personne</>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Vous n'avez pas de rendez-vous à venir.</p>
                <button 
                  className="view-calendar-button"
                  onClick={() => navigateTo('/clinique-calendrier')}
                >
                  <i className="fa-solid fa-calendar"></i> Voir le calendrier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-section messages-section">
        <div className="section-header">
          <h2>Messagerie</h2>
          <button 
            className="section-action-button"
            onClick={() => navigateTo('/clinique-messagerie')}
          >
            Voir tout
          </button>
        </div>
        
        <div className="section-content">
          <div className="scrollable-content">
            <div className="messages-preview">
              {messages.length > 0 ? (
                messages.map(message => (
                  <div 
                    key={message.id} 
                    className="message-preview-card"
                    onClick={() => goToConversation(message.conversationId)}
                  >
                    {message.unread && <div className="unread-badge"></div>}
                    <div className={`message-avatar ${message.avatarType || 'default'}`}>
                      {message.avatar || message.sender.charAt(0)}
                    </div>
                    <div className="message-preview-content">
                      <h3>{message.sender}</h3>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-messages">
                  <p>Aucun message</p>
                </div>
              )}
            </div>
            
            <div className="section-actions">
              <button 
                className="primary-button"
                onClick={() => navigateTo('/clinique-messagerie')}
              >
                <i className="fa-solid fa-envelope"></i> Voir tous les messages
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions enhanced">
        <h2>Actions rapides</h2>
        <div className="quick-action-buttons">
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/clinique-cree')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-plus-circle"></i>
            </div>
            <span>Créer une offre</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/clinique-calendrier')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-calendar-alt"></i>
            </div>
            <span>Gérer le calendrier</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/clinique-messagerie')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-comment-dots"></i>
            </div>
            <span>Consulter les messages</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/clinique-profil')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-user-cog"></i>
            </div>
            <span>Gérer mon profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrincipaleClinique;