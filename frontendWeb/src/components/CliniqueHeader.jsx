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

  return (
    <header className="clinique-header">
      <div className="clinique-header-container">
        <div className="clinique-logo-container" onClick={goToHome}>
          <img src="/assets/img/dentify_logo_noir.png" alt="Dentify Logo" className="clinique-logo" />
        </div>
        
        <div className="clinique-header-actions">
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