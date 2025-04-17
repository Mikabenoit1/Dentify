import React from 'react';
import '../styles/NotFound.css';
import DentImage from './Dent.png';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <img src={DentImage} alt="Dent avec carie" className="notfound-image" />
        <h1 className="notfound-title">Oups ! Page introuvable</h1>
        <p className="notfound-message">
          Il semble qu'une carie ait rongé cette page... Elle n'existe plus ou n'a jamais existé.
        </p>
        <a href="/" className="notfound-button">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
