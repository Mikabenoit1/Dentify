import '../styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function Header({ openSidebar }) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    openSidebar();
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    // Naviguer vers la page de connexion en indiquant qu'on veut afficher la connexion
    navigate('/login', { state: { showSignUp: false } });
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Fermer la barre de recherche en cliquant ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="logo">
        <img 
          src="/assets/img/dentify_logo_noir.png" 
          alt="DENTify Logo" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <nav>
        {/* Barre de recherche */}
        <div className="search-box" ref={searchRef}>
          <button className="btn-search" onClick={toggleSearch}>
            <i className="fa fa-search"></i>
          </button>
          <input
            type="text"
            className={`input-search ${isSearchOpen ? 'expanded' : ''}`}
            placeholder="Rechercher..."
          />
        </div>
        
        <a href="#" onClick={handleLoginClick}>CONNEXION</a>
        <a href="#" id="menu-button" onClick={handleMenuClick}>MENU</a>
      </nav>
    </header>
  );
}

export default Header;