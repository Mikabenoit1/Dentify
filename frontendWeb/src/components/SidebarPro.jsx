import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SidebarPro.css';

const SidebarPro = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const menuItems = [
    { icon: 'fa-solid fa-house', text: 'Accueil', path: '/principale' },
    { icon: 'fa-solid fa-briefcase', text: 'Offres ouvertes', path: '/offres' },
    { icon: 'fa-solid fa-clipboard-list', text: 'Mes candidatures', path: '/applique' },
    { icon: 'fa-solid fa-calendar', text: 'Calendrier', path: '/calendrier' },
    { icon: 'fa-solid fa-comments', text: 'Messagerie', path: '/messagerie' },
    { icon: 'fa-solid fa-id-card-clip', text: 'Mon compte', path: '/mon-compte', isAccount: true }
  ];

  // Définir l'élément actif en fonction de l'URL courante
  useEffect(() => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => currentPath.startsWith(item.path));
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
            <a>
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

export default SidebarPro;