import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/CliniqueCree.css';

const CliniqueCree = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Pour l'édition
  const { addOffer, updateOffer, getOfferById } = useOffers();
  const addressInputRef = useRef(null);
  
  // État pour le formulaire de création d'offre avec heures
  const [newOffer, setNewOffer] = useState({
    title: '',
    profession: 'dentiste',
    startDate: '',
    endDate: '',
    startTime: '09:00',  // Heure de début
    endTime: '17:00',    // Heure de fin
    description: '',
    requirements: '',
    compensation: '',
    location: '',       // Adresse complète
    coordinates: null,  // Coordonnées {lat, lng}
    isSingleDay: false  // Offre d'une journée
  });

  // Charger l'offre existante si en mode édition
  useEffect(() => {
    if (id) {
      const existingOffer = getOfferById(parseInt(id));
      if (existingOffer) {
        // Assurer que les champs d'heure existent même pour les anciennes offres
        const updatedOffer = {
          ...existingOffer,
          startTime: existingOffer.startTime || '09:00',
          endTime: existingOffer.endTime || '17:00',
          location: existingOffer.location || '',
          coordinates: existingOffer.coordinates || null,
          isSingleDay: existingOffer.startDate === existingOffer.endDate
        };
        setNewOffer(updatedOffer);
      }
    }
  }, [id, getOfferById]);

  // Gère les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isSingleDay') {
      // Si on coche "Offre d'une journée", synchroniser les dates
      if (checked && newOffer.startDate) {
        setNewOffer(prev => ({
          ...prev,
          endDate: prev.startDate,
          isSingleDay: true
        }));
      } else {
        setNewOffer(prev => ({
          ...prev,
          isSingleDay: false
        }));
      }
    } else if (name === 'startDate' && newOffer.isSingleDay) {
      // Si c'est une offre d'une journée et qu'on change la date de début, synchroniser la date de fin
      setNewOffer(prev => ({
        ...prev,
        startDate: value,
        endDate: value
      }));
    } else if (name === 'location') {
      // Permettre de saisir manuellement une adresse
      setNewOffer(prev => ({
        ...prev,
        location: value,
        // Garder les coordonnées existantes ou utiliser des coordonnées par défaut
        coordinates: prev.coordinates || { lat: 45.2538, lng: -74.1334 } // Coordonnées pour Valleyfield
      }));
    } else {
      // Pour les autres champs
      setNewOffer(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Prévisualisation de l'offre avec validation
  const togglePreview = () => {
    // Si on quitte la prévisualisation, on revient simplement à l'édition
    if (previewMode) {
      setPreviewMode(false);
      return;
    }
    
    // Vérification des champs obligatoires avant d'entrer en mode prévisualisation
    const requiredFields = {
      title: newOffer.title,
      startDate: newOffer.startDate,
      endDate: newOffer.endDate,
      startTime: newOffer.startTime,
      endTime: newOffer.endTime,
      description: newOffer.description,
      compensation: newOffer.compensation,
      location: newOffer.location
    };
    
    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.trim() === '')
      .map(([key, _]) => key);
    
    if (emptyFields.length > 0) {
      // Afficher une alerte avec les champs manquants
      alert(`Veuillez remplir tous les champs obligatoires avant de prévisualiser l'offre: ${emptyFields.join(', ')}`);
      return;
    }
    
    // Générer des coordonnées par défaut si absentes
    if (!newOffer.coordinates) {
      setNewOffer(prev => ({
        ...prev,
        coordinates: { lat: 45.2538, lng: -74.1334 } // Coordonnées par défaut pour Valleyfield
      }));
    }
    
    // Si tous les champs obligatoires sont remplis, on active le mode prévisualisation
    setPreviewMode(true);
  };

  // Formater les dates pour l'affichage
  const formatDateRange = () => {
    if (newOffer.startDate === newOffer.endDate) {
      return `Le ${newOffer.startDate}`;
    } else {
      return `Du ${newOffer.startDate} au ${newOffer.endDate}`;
    }
  };

  // Soumission du formulaire avec validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérification des champs obligatoires avant la soumission
    const requiredFields = {
      title: newOffer.title,
      startDate: newOffer.startDate,
      endDate: newOffer.endDate,
      startTime: newOffer.startTime,
      endTime: newOffer.endTime,
      description: newOffer.description,
      compensation: newOffer.compensation,
      location: newOffer.location
    };
    
    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.trim() === '')
      .map(([key, _]) => key);
    
    if (emptyFields.length > 0) {
      // Afficher une alerte avec les champs manquants
      alert(`Veuillez remplir tous les champs obligatoires avant de publier l'offre: ${emptyFields.join(', ')}`);
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const offerToSubmit = {
      ...newOffer,
      id: id ? parseInt(id) : Date.now(),
      datePosted: id ? newOffer.datePosted : today,
      status: id ? newOffer.status : 'pending',
      applications: id ? newOffer.applications : 0,
      isSingleDay: newOffer.startDate === newOffer.endDate,
      coordinates: newOffer.coordinates || { lat: 45.2538, lng: -74.1334 } // Coordonnées par défaut
    };
    
    // Ajouter ou mettre à jour l'offre
    if (id) {
      updateOffer(offerToSubmit);
    } else {
      addOffer(offerToSubmit);
    }
    
    // Naviguer vers la page des offres après publication
    navigate('/clinique-offres');
  };

  return (
    <div className="clinique-cree-container">
      <div className="create-offer-section">
        <h2>
          {previewMode ? 'Prévisualisation de l\'offre' : (id ? 'Modifier une offre' : 'Création d\'une nouvelle offre')}
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
          // Mode prévisualisation - redesigned for wider layout
          <div className="offer-preview">
            <div className="preview-header">
              <h3>{newOffer.title || "Titre de l'offre"}</h3>
              <span className="status-badge pending">Prévisualisation</span>
            </div>
            
            <div className="preview-section">
              <h4>Informations générales</h4>
              <p><strong>Profession:</strong> {newOffer.profession === 'dentiste' ? 'Dentiste' : 
                                              newOffer.profession === 'assistant' ? 'Assistant(e) dentaire' : 
                                              'Hygiéniste dentaire'}</p>
              <p><strong>Période:</strong> {formatDateRange()}</p>
              <p><strong>Horaires:</strong> {newOffer.startTime || "09:00"} à {newOffer.endTime || "17:00"}</p>
              <p><strong>Adresse:</strong> {newOffer.location}</p>
            </div>
            
            <div className="preview-section">
              <h4>Description</h4>
              <p>{newOffer.description || "Aucune description fournie."}</p>
            </div>
            
            <div className="preview-section">
              <h4>Exigences</h4>
              <p>{newOffer.requirements || "Aucune exigence spécifiée."}</p>
            </div>
            
            <div className="preview-section">
              <h4>Rémunération</h4>
              <p>{newOffer.compensation || "Non spécifiée"}</p>
            </div>
            
            <div className="preview-actions">
              <button className="cancel-button" onClick={togglePreview}>
                Retour à l'édition
              </button>
              <button 
                className="submit-button" 
                onClick={handleSubmit}
              >
                {id ? 'Mettre à jour' : 'Publier l\'offre'}
              </button>
            </div>
          </div>
        ) : (
          // Mode édition (formulaire) - restructured for wider layout
          <form className="create-offer-form" onSubmit={handleSubmit}>
            <div className="form-sections-container">
              <div className="form-section">
                <h3>Informations générales</h3>
                
                <div className="form-group">
                  <label htmlFor="title" className="required-field">Titre de l'offre</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newOffer.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Remplacement dentiste pendant congés d'été"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="profession" className="required-field">Profession recherchée</label>
                  <select
                    id="profession"
                    name="profession"
                    value={newOffer.profession}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="dentiste">Dentiste</option>
                    <option value="assistant">Assistant(e) dentaire</option>
                    <option value="hygieniste">Hygiéniste dentaire</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id="isSingleDay"
                      name="isSingleDay"
                      checked={newOffer.isSingleDay}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-label">Offre d'une seule journée</span>
                  </label>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate" className="required-field">Date de début</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newOffer.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate" className="required-field">Date de fin</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newOffer.endDate}
                      onChange={handleInputChange}
                      disabled={newOffer.isSingleDay}
                      required
                    />
                    {newOffer.isSingleDay && (
                      <small className="help-text">Pour une offre d'une journée, la date de fin est automatiquement la même que la date de début</small>
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime" className="required-field">Heure de début</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={newOffer.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endTime" className="required-field">Heure de fin</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={newOffer.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="location" className="required-field">Adresse du cabinet</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newOffer.location}
                    onChange={handleInputChange}
                    placeholder="Entrez l'adresse du cabinet"
                    ref={addressInputRef}
                    required
                  />
                  <small className="help-text">
                    Vous pouvez saisir directement l'adresse complète de votre cabinet
                  </small>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Détails de l'offre</h3>
                
                <div className="form-group">
                  <label htmlFor="description" className="required-field">Description du poste</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newOffer.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez les responsabilités et le contexte du remplacement..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="requirements">Exigences</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={newOffer.requirements}
                    onChange={handleInputChange}
                    placeholder="Expérience, qualifications, compétences requises..."
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="compensation" className="required-field">Rémunération proposée</label>
                  <input
                    type="text"
                    id="compensation"
                    name="compensation"
                    value={newOffer.compensation}
                    onChange={handleInputChange}
                    placeholder="Ex: 350€/jour, pourcentage sur le chiffre d'affaires..."
                    required
                  />
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
                {id ? 'Mettre à jour' : 'Publier l\'offre'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CliniqueCree;