import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SidebarCli.css';

const SidebarCli = ({ isOpen, closeSidebar }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: 'fa-solid fa-house', text: 'Accueil', path: '/principaleclinique' },
    { icon: 'fa-solid fa-file', text: 'Offres publiées', path: '/clinique-offres' },
    { icon: 'fa-solid fa-file-circle-plus', text: 'Créer une offre', path: '/clinique-cree' },
    { icon: 'fa-solid fa-calendar', text: 'Calendrier', path: '/clinique-calendrier' },
    { icon: 'fa-solid fa-comments', text: 'Messagerie', path: '/clinique-messagerie' },
    { icon: 'fa-solid fa-building-user', text: 'Ma clinique', path: '/clinique-profile', isAccount: true }
  ];

  // Effet pour mettre à jour l'index actif en fonction de l'URL
  useEffect(() => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => item.path === currentPath);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  const handleClick = (index, path) => {
    setActiveIndex(index);
    // Force l'expansion de la sidebar lorsqu'un élément est cliqué
    setSidebarExpanded(true);
    
    // Naviguer vers la page correspondante
    navigate(path);
  };

  return (
    <div className={`navigation ${isOpen ? 'open' : ''} ${sidebarExpanded ? 'expanded' : ''}`}>
      <ul>
        {menuItems.map((item, index) => (
          <li 
            key={index} 
            className={`${activeIndex === index ? 'active' : ''} ${item.isAccount ? 'account-link' : ''}`}
            onClick={() => handleClick(index, item.path)}
          >
            <a href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon">
                <i className={item.icon}></i>
              </span>
              <span className="text">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCli;