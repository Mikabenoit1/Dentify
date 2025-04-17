import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  
  // État pour stocker les notifications
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('toutes');
  
  // Simuler le chargement des notifications
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'offre',
          title: 'Nouvelle offre disponible',
          message: 'Une nouvelle offre correspondant à votre profil est disponible',
          date: '2023-11-15T10:30:00',
          isRead: false,
          link: '/offre/123'
        },
        {
          id: 2,
          type: 'candidature',
          title: 'Candidature acceptée',
          message: 'Votre candidature a été acceptée par Cabinet Dentaire Saint-Michel',
          date: '2023-11-14T09:15:00',
          isRead: true,
          link: '/candidature/456'
        },
        {
          id: 3,
          type: 'message',
          title: 'Nouveau message',
          message: 'Vous avez reçu un nouveau message de Dr. Martin',
          date: '2023-11-13T14:45:00',
          isRead: false,
          link: '/messages/789'
        },
        {
          id: 4,
          type: 'systeme',
          title: 'Mise à jour de profil',
          message: 'Votre profil a été mis à jour avec succès',
          date: '2023-11-10T16:20:00',
          isRead: true,
          link: '/profil'
        },
        {
          id: 5,
          type: 'offre',
          title: 'Offre expirée',
          message: 'Une offre à laquelle vous avez postulé a expiré',
          date: '2023-11-05T11:00:00',
          isRead: true,
          link: '/historique-offres'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filtrer les notifications selon l'onglet actif
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'toutes') return true;
    if (activeTab === 'nonlues') return !notification.isRead;
    return notification.type === activeTab;
  });
  
  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };
  
  // Compter les notifications non lues
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };
  
  // Obtenir l'icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'offre':
        return <i className="fa-solid fa-briefcase"></i>;
      case 'candidature':
        return <i className="fa-solid fa-file-contract"></i>;
      case 'message':
        return <i className="fa-solid fa-envelope"></i>;
      case 'systeme':
        return <i className="fa-solid fa-gear"></i>;
      default:
        return <i className="fa-solid fa-bell"></i>;
    }
  };
  
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-button"
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </button>
        )}
      </div>
      
      <div className="notifications-content">
        <div className="notifications-tabs">
          <button 
            className={`tab-button ${activeTab === 'toutes' ? 'active' : ''}`}
            onClick={() => setActiveTab('toutes')}
          >
            Toutes
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
          </button>
          <button 
            className={`tab-button ${activeTab === 'nonlues' ? 'active' : ''}`}
            onClick={() => setActiveTab('nonlues')}
          >
            Non lues
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button 
            className={`tab-button ${activeTab === 'offre' ? 'active' : ''}`}
            onClick={() => setActiveTab('offre')}
          >
            Offres
          </button>
          <button 
            className={`tab-button ${activeTab === 'candidature' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidature')}
          >
            Candidatures
          </button>
          <button 
            className={`tab-button ${activeTab === 'message' ? 'active' : ''}`}
            onClick={() => setActiveTab('message')}
          >
            Messages
          </button>
        </div>
        
        <div className="notifications-list">
          {isLoading ? (
            <div className="loading-indicator">
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <p>Chargement des notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-notifications">
              <i className="fa-regular fa-bell-slash"></i>
              <p>Aucune notification {activeTab !== 'toutes' ? 'dans cette catégorie' : ''}</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => {
                  markAsRead(notification.id);
                  navigate(notification.link);
                }}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className="notification-date">{formatDate(notification.date)}</span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                </div>
                {!notification.isRead && <span className="unread-indicator"></span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
