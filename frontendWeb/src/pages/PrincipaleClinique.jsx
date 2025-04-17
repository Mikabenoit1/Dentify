import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/PrincipaleClinique.css';

const PrincipaleClinique = () => {
  const navigate = useNavigate();
  const { offers, meetings } = useOffers();
  const [recentOffers, setRecentOffers] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [stats, setStats] = useState({
    activeOffers: 0,
    pendingOffers: 0,
    totalApplications: 0,
    pendingMeetings: 0
  });

  // Messages fictifs avec des IDs qui correspondent à ceux de CliniqueMessagerie
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Leslie Labrecque',
      avatar: 'D',
      avatarType: 'dentiste',
      content: 'Bonjour, je suis intéressée par votre offre de remplacement pour l\'été...',
      unread: true,
      conversationId: 1  // ID correspondant à la conversation avec Leslie dans CliniqueMessagerie
    },
    {
      id: 2,
      sender: 'Thomas Simard',
      avatar: 'T',
      avatarType: 'assistant',
      content: 'Merci pour les informations. Je voudrais savoir si le poste peut évoluer...',
      unread: false,
      conversationId: 2  // ID correspondant à la conversation avec Thomas dans CliniqueMessagerie
    },
    {
      id: 3,
      sender: 'Marie Curie',
      avatar: 'M',
      avatarType: 'hygieniste',
      content: 'Bonjour, suite à notre entretien téléphonique, je vous confirme mon intérêt...',
      unread: true,
      conversationId: 3  // ID correspondant à la conversation avec Marie dans CliniqueMessagerie
    }
  ]);

  // Récupérer les offres récentes, rendez-vous à venir et statistiques
  useEffect(() => {
    // Trier les offres par date de publication (plus récentes d'abord)
    const sortedOffers = [...offers].sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    setRecentOffers(sortedOffers);

    // Calculer les statistiques
    const activeOffers = offers.filter(offer => offer.status === 'active').length;
    const pendingOffers = offers.filter(offer => offer.status === 'pending').length;
    const totalApplications = offers.reduce((total, offer) => total + (offer.applications || 0), 0);

    // Filtrer les rendez-vous à venir (après aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = [...meetings]
      .filter(meeting => new Date(meeting.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setUpcomingMeetings(upcoming);
    
    setStats({
      activeOffers,
      pendingOffers,
      totalApplications,
      pendingMeetings: upcoming.length
    });
  }, [offers, meetings]);

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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="principale-clinique-container">
      <div className="dashboard-header">
        <h1>Tableau de bord - Clinique</h1>
        <p className="welcome-message">Bienvenue dans votre espace clinique</p>
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
                    <div key={offer.id} className={`recent-offer-card ${offer.status}`}>
                      <div className="offer-card-header">
                        <h3>{offer.title}</h3>
                        <span className={`status-badge ${offer.status}`}>
                          {offer.status === 'active' ? 'Active' : 
                          offer.status === 'pending' ? 'En attente' : 'Expirée'}
                        </span>
                      </div>
                      <p className="offer-date">Publiée le {formatDate(offer.datePosted)}</p>
                      <p className="offer-period">Du {formatDate(offer.startDate)} au {formatDate(offer.endDate)}</p>
                      <p className="offer-applications">
                        <i className="fa-solid fa-user-group"></i> {offer.applications || 0} candidature(s)
                      </p>
                      <button 
                        className="view-details-button"
                        onClick={() => navigateTo(`/clinique-offres/${offer.id}`)}
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
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className="message-preview-card"
                  onClick={() => goToConversation(message.conversationId)}
                >
                  {message.unread && <div className="unread-badge"></div>}
                  <div className={`message-avatar ${message.avatarType}`}>{message.avatar}</div>
                  <div className="message-preview-content">
                    <h3>{message.sender}</h3>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
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
            onClick={() => navigateTo('/clinique-offres')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <span>Voir mes offres</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrincipaleClinique;