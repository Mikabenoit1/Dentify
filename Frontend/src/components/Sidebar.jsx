import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, closeSidebar }) {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && 
        !event.target.closest('#menu-button')
      ) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, closeSidebar]);

  const handleCreateAccount = () => {
    // Naviguer vers la page de connexion en indiquant qu'on veut afficher l'inscription
    navigate('/login', { state: { showSignUp: true } });
    closeSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef} id="sidebar">
      <button className="close-btn" onClick={closeSidebar}>&times;</button>
      <div className="container">
        <div className="link" onClick={() => navigate('/')}>
          <div className="text">ACCUEIL</div>
        </div>
        <div className="link" onClick={() => navigate('/services')}>
          <div className="text">FONCTIONNALITÉS</div>
        </div>
        <div className="link" onClick={() => navigate('/professions')}>
          <div className="text">PROFESSIONS</div>
        </div>
        <div className="link" onClick={() => navigate('/contact')}>
          <div className="text">CONTACT</div>
        </div>
        <div className="link" onClick={() => navigate('/propos')}>
          <div className="text">À PROPOS</div>
        </div>
        <div className="link" onClick={handleCreateAccount}>
          <div className="text">CRÉER UN COMPTE</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;