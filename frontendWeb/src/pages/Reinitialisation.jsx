import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Reinitialisation.css';

const Reinitialisation = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation de base de l'email
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez saisir une adresse e-mail valide');
      return;
    }
    
    // Ici, vous pourriez implémenter l'appel API pour envoyer le lien de réinitialisation
    // Par exemple: sendResetLink(email);
    
    // Pour cette démo, nous simulons un envoi réussi
    setIsSubmitted(true);
    setErrorMessage('');
  };
  
  const handleRetourLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h1>Mot de passe oublié ?</h1>
        
        {isSubmitted ? (
          <div className="success-message">
            <p>
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
              Vérifiez votre boîte de réception et suivez les instructions.
            </p>
            <button 
              className="primary-button"
              onClick={handleRetourLogin}
            >
              Retourner à la connexion
            </button>
          </div>
        ) : (
          <>
            <p className="instructions">
              Saisissez votre adresse e-mail ci-dessous pour 
              recevoir un lien de réinitialisation.
            </p>
            
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="email-input"
                required
              />
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleRetourLogin}
              >
                ANNULER
              </button>
              <button 
                type="button" 
                className="submit-button"
                onClick={handleSubmit}
              >
                ENVOYER LE LIEN
              </button>
            </div>
            
            <div className="help-section">
              <span className="help-icon">?</span> Besoin d'aide ? <a href="#">Contactez-nous</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reinitialisation;