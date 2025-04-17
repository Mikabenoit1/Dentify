import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfessionnelEvalation.css'; // We'll create this CSS file

const ProfessionnelEvaluation = () => {
  const navigate = useNavigate();
  
  // État pour le formulaire d'avis
  const [review, setReview] = useState({
    rating: 0,
    comment: ''
  });
  
  // État pour afficher la prévisualisation
  const [previewMode, setPreviewMode] = useState(false);
  
  // Gestion du changement de notation (étoiles)
  const handleRatingChange = (newRating) => {
    setReview(prev => ({
      ...prev,
      rating: newRating
    }));
  };
  
  // Gestion du changement dans le champ de commentaire
  const handleCommentChange = (e) => {
    setReview(prev => ({
      ...prev,
      comment: e.target.value
    }));
  };
  
  // Basculer entre le mode édition et prévisualisation
  const togglePreview = () => {
    // Si on quitte la prévisualisation, on revient simplement à l'édition
    if (previewMode) {
      setPreviewMode(false);
      return;
    }
    
    // Vérification des champs obligatoires avant d'entrer en mode prévisualisation
    if (review.rating === 0) {
      alert('Veuillez sélectionner une note avant de prévisualiser');
      return;
    }
    
    if (!review.comment || review.comment.trim() === '') {
      alert('Veuillez ajouter un commentaire avant de prévisualiser');
      return;
    }
    
    // Si tous les champs obligatoires sont remplis, on active le mode prévisualisation
    setPreviewMode(true);
  };
  
  // Soumission du formulaire avec validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérification des champs obligatoires avant la soumission
    if (review.rating === 0) {
      alert('Veuillez sélectionner une note avant de soumettre votre avis');
      return;
    }
    
    if (!review.comment || review.comment.trim() === '') {
      alert('Veuillez ajouter un commentaire avant de soumettre votre avis');
      return;
    }
    
    // Traitement de la soumission (à compléter avec votre logique d'enregistrement)
    const reviewToSubmit = {
      ...review,
      id: Date.now(),
      datePosted: new Date().toISOString().split('T')[0]
    };
    
    // Vous pourriez appeler une méthode pour enregistrer l'avis ici
    console.log('Avis soumis:', reviewToSubmit);
    
    // Redirection après soumission (à adapter selon votre structure)
    alert('Votre avis a été soumis avec succès!');
    navigate('/clinique-offres'); // Rediriger vers la page appropriée
  };
  
  // Rendu des étoiles pour la notation
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= review.rating ? 'selected' : ''}`}
          onClick={() => handleRatingChange(i)}
        >
          <i className={`fa-${i <= review.rating ? 'solid' : 'regular'} fa-star`}></i>
        </span>
      );
    }
    
    return stars;
  };
  
  return (
    <div className="clinique-avis-container">
      <div className="create-review-section">
        <h2>
          {previewMode ? 'Prévisualisation de l\'avis' : 'Évaluation du profesionnel dentaire'}
          <button className="preview-toggle" onClick={togglePreview}>
            {previewMode ? (
              <>
                <i className="fa-solid fa-pen"></i> Retour à l'édition
              </>
            ) : (
              <>
                <i className="fa-solid fa-eye"></i> Prévisualiser
              </>
            )}
          </button>
        </h2>

        {previewMode ? (
          // Mode prévisualisation
          <div className="review-preview">
            <div className="preview-header">
              <div className="preview-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="preview-star">
                    <i className={`fa-solid fa-star ${i < review.rating ? 'filled' : 'empty'}`}></i>
                  </span>
                ))}
                <span className="rating-text">{review.rating}/5</span>
              </div>
              <span className="status-badge pending">Prévisualisation</span>
            </div>
            
            <div className="preview-section">
              <h4>Commentaire</h4>
              <p>{review.comment}</p>
            </div>
            
            <div className="preview-actions">
              <button className="cancel-button" onClick={togglePreview}>
                Retour à l'édition
              </button>
              <button 
                className="submit-button" 
                onClick={handleSubmit}
              >
                Publier l'avis
              </button>
            </div>
          </div>
        ) : (
          // Mode édition (formulaire)
          <form className="create-review-form" onSubmit={handleSubmit}>
            <div className="form-sections-container">
              <div className="form-section">
                <h3>Votre évaluation</h3>
                
                <div className="form-group">
                  <label htmlFor="rating" className="required-field">Note</label>
                  <div className="rating-input">
                    {renderStars()}
                    {review.rating > 0 && <span className="rating-value">{review.rating}/5</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="comment" className="required-field">Commentaires</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={review.comment}
                    onChange={handleCommentChange}
                    placeholder="Ses compétences techniques, son professionnalisme, sa ponctualité, sa communication avec les patients, son efficacité..."
                    rows="6"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/clinique-offres')}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="preview-button"
                onClick={togglePreview}
              >
                Prévisualiser
              </button>
              <button 
                type="submit" 
                className="submit-button"
              >
                Publier l'avis
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfessionnelEvaluation;