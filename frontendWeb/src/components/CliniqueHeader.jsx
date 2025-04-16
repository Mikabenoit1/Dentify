import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CliniqueHeader.css';

const CliniqueHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ici vous pouvez ajouter la logique de déconnexion
    // Par exemple, supprimer les tokens de localStorage, réinitialiser l'état, etc.
    localStorage.removeItem('authToken'); // Exemple
    
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  const goToHome = () => {
    // Rediriger vers la page d'accueil clinique
    navigate('/principaleclinique');
  };

  const goToParameters = () => {
    // Rediriger vers la page des paramètres
    navigate('/parametres');
  };
  
  const goToNotifications = () => {
    // Rediriger vers la page des notifications
    navigate('/notifications');
  };

  return (
    <header className="clinique-header">
      <div className="clinique-header-container">
        <div className="clinique-logo-container" onClick={goToHome}>
          <img src="/assets/img/dentify_logo_noir.png" alt="Dentify Logo" className="clinique-logo" />
        </div>
        
        <div className="clinique-header-actions">
          <button className="clinique-notifications-button" onClick={goToNotifications}>
            <i className="fa-solid fa-bell"></i>
            <span>Notifications</span>
            <span className="notification-badge">3</span>
          </button>
          <button className="clinique-settings-button" onClick={goToParameters}>
            <i className="fa-solid fa-gear"></i>
            <span>Paramètres</span>
          </button>
          <button className="clinique-logout-button" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default CliniqueHeader;
