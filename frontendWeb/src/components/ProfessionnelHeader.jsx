import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfessionnelHeader.css';
import { useEffect, useState } from 'react';

const ProfessionnelHeader = () => {
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
    navigate('/principale');
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
    <header className="pro-header">
      <div className="pro-header-container">
        <div className="pro-logo-container" onClick={goToHome}>
          <img src="/assets/img/dentify_logo_noir.png" alt="Dentify Logo" className="pro-logo" />
        </div>
        
        <div className="pro-header-actions">
          <button className="pro-notifications-button" onClick={goToNotifications}>
            <i className="fa-solid fa-bell"></i>
            <span>Notifications</span>
            {unreadCount > 0 && (<span className="notification-badge">{unreadCount}</span>)}
          </button>
          <button className="pro-settings-button" onClick={goToParameters}>
            <i className="fa-solid fa-gear"></i>
            <span>Paramètres</span>
          </button>
          <button className="pro-logout-button" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProfessionnelHeader;
