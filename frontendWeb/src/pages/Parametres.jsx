import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Parametres.css';

const Parametres = () => {
  const navigate = useNavigate();
  
  // États pour les différentes sections de paramètres
  const [userInfo, setUserInfo] = useState({
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@exemple.com',
    telephone: '06 12 34 56 78'
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    newsletter: false,
    langagePrefere: 'fr',
    stayConnected: true, // Option pour rester connecté
    contactPreference: 'email' // Préférence de contact
  });
  
  const [activeTab, setActiveTab] = useState('profil');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fonction pour gérer les changements dans les champs du profil
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fonction pour gérer les changements de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fonction pour gérer les changements de préférences
  const handlePreferenceChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Fonction pour enregistrer les modifications du profil
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Ici, vous implémenteriez l'appel API pour sauvegarder les données
    // Simulation d'un succès
    setSuccessMessage('Informations personnelles mises à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Fonction pour changer le mot de passe
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (password.new !== password.confirm) {
      setErrorMessage('Les nouveaux mots de passe ne correspondent pas');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (password.new.length < 8) {
      setErrorMessage('Le nouveau mot de passe doit contenir au moins 8 caractères');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    // Simulation d'un succès
    setSuccessMessage('Mot de passe modifié avec succès');
    setPassword({ current: '', new: '', confirm: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Fonction pour sauvegarder les préférences
  const handleSavePreferences = (e) => {
    e.preventDefault();
    // Simulation d'un succès
    setSuccessMessage('Préférences mises à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  return (
    <div className="parametres-container">
      <div className="parametres-header">
        <h1>Paramètres du compte</h1>
      </div>
      
      <div className="parametres-content">
        <div className="parametres-tabs">
          <button 
            className={`tab-button ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            <i className="fa-solid fa-user"></i> Profil
          </button>
          <button 
            className={`tab-button ${activeTab === 'securite' ? 'active' : ''}`}
            onClick={() => setActiveTab('securite')}
          >
            <i className="fa-solid fa-lock"></i> Sécurité
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <i className="fa-solid fa-gear"></i> Préférences
          </button>
        </div>
        
        <div className="parametres-panels">
          {successMessage && (
            <div className="success-message">
              <i className="fa-solid fa-check-circle"></i> {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="error-message">
              <i className="fa-solid fa-exclamation-triangle"></i> {errorMessage}
            </div>
          )}
          
          {activeTab === 'profil' && (
            <div className="panel">
              <h2>Informations personnelles</h2>
              <form onSubmit={handleSaveProfile}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input 
                      type="text" 
                      id="prenom" 
                      name="prenom" 
                      value={userInfo.prenom}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input 
                      type="text" 
                      id="nom" 
                      name="nom" 
                      value={userInfo.nom}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Adresse e-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telephone">Téléphone</label>
                    <input 
                      type="tel" 
                      id="telephone" 
                      name="telephone" 
                      value={userInfo.telephone}
                      onChange={handleUserInfoChange}
                      placeholder="Ex: 06 12 34 56 78"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button">
                    Annuler
                  </button>
                  <button type="submit" className="save-button">
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'securite' && (
            <div className="panel">
              <h2>Modification du mot de passe</h2>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="current">Mot de passe actuel</label>
                  <input 
                    type="password" 
                    id="current" 
                    name="current" 
                    value={password.current}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="new">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    id="new" 
                    name="new" 
                    value={password.new}
                    onChange={handlePasswordChange}
                    required
                  />
                  <small className="help-text">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirm">Confirmer le nouveau mot de passe</label>
                  <input 
                    type="password" 
                    id="confirm" 
                    name="confirm" 
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="stayConnected"
                      checked={preferences.stayConnected}
                      onChange={handlePreferenceChange}
                    />
                    <span className="custom-checkbox"></span>
                    <span className="checkbox-label">Rester connecté (connexion automatique lors de vos prochaines visites)</span>
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button">
                    Annuler
                  </button>
                  <button type="submit" className="save-button">
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="panel">
              <h2>Préférences</h2>
              <form onSubmit={handleSavePreferences}>
                <h3 className="section-title">Notifications</h3>
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={preferences.notifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="custom-checkbox"></span>
                    <span className="checkbox-label">Recevoir des notifications par e-mail</span>
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={preferences.newsletter}
                      onChange={handlePreferenceChange}
                    />
                    <span className="custom-checkbox"></span>
                    <span className="checkbox-label">S'abonner à la newsletter</span>
                  </label>
                </div>
                
                <h3 className="section-title">Méthode de contact préférée</h3>
                <div className="form-group">
                  <select
                    id="contactPreference"
                    name="contactPreference"
                    value={preferences.contactPreference}
                    onChange={handlePreferenceChange}
                    className="select-input"
                  >
                    <option value="email">E-mail</option>
                    <option value="telephone">Téléphone</option>
                    <option value="sms">SMS</option>
                  </select>
                  <small className="help-text">
                    Cette option détermine comment nous vous contacterons prioritairement.
                  </small>
                </div>
              
                
                <div className="form-actions">
                  <button type="button" className="cancel-button">
                    Annuler
                  </button>
                  <button type="submit" className="save-button">
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parametres;