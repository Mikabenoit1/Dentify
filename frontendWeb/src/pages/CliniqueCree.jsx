import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOffer, updateOffer, deleteOffer, fetchOfferById } from '../lib/offerApi';
import { fetchClinicProfile } from '../lib/clinicApi'; // Importation de la fonction
import '../styles/CliniqueCree.css';



// Formate une heure "HH:MM" proprement
const formatHeure = (heureStr) => {
  if (!heureStr || !heureStr.includes(':')) return 'Heure invalide';
  const [hour, minute] = heureStr.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

const CliniqueCree = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Pour l'édition
  const addressRef = useRef(null);
  
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

  // Récupérer l'adresse de la clinique au chargement initial
  useEffect(() => {
    const loadClinicAddress = async () => {
      try {
        // Uniquement si nous ne sommes pas en mode édition et que l'adresse est vide
        if (!id && !newOffer.location) {
          const clinicProfile = await fetchClinicProfile();
          
          // Vérifier si nous avons une adresse complète ou des coordonnées
          if (clinicProfile.adresse_complete || clinicProfile.adresse) {
            setNewOffer(prev => ({
              ...prev,
              location: clinicProfile.adresse_complete || clinicProfile.adresse,
              coordinates: clinicProfile.coordinates || { lat: 45.2538, lng: -74.1334 }
            }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'adresse de la clinique:", error);
        // En cas d'erreur, on ne fait rien - l'utilisateur devra saisir l'adresse
      }
    };
    
    loadClinicAddress();
  }, []); // Exécuté uniquement au montage du composant
  
  // Charger l'offre existante si en mode édition
  useEffect(() => {
    const loadOffer = async () => {
      try {
        if (id) {
          const data = await fetchOfferById(id);
          
          // Extraction des heures en ignorant les fuseaux horaires
          const startTime = data.heure_debut 
            ? extractTimeString(data.heure_debut) 
            : '09:00';
          
          const endTime = data.heure_fin 
            ? extractTimeString(data.heure_fin) 
            : '17:00';
    
          setNewOffer({
            title: data.titre || '',
            profession: data.type_professionnel || 'dentiste',
            startDate: data.date_debut || '',
            endDate: data.date_fin || '',
            startTime: startTime,
            endTime: endTime,
            description: data.descript || '',
            requirements: data.competences_requises || '',
            compensation: data.remuneration?.toString() || '',
            location: data.adresse_complete || '',
            coordinates: {
              lat: data.latitude || 45.2538,
              lng: data.longitude || -74.1334
            },
            isSingleDay: data.date_debut === data.date_fin
          });
        }
      } catch (error) {
        alert("Erreur lors du chargement de l'offre à modifier.");
        console.error("❌ Chargement échoué :", error);
      }
    };
  
    loadOffer();
  }, [id]);

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

  const extractTimeString = (dateTime) => {
    if (!dateTime) return null;
    
    try {
      // 1. Format ISO avec T et Z (UTC)
      if (typeof dateTime === 'string' && dateTime.includes('T')) {
        // Extraire directement de la chaîne
        const timeParts = dateTime.split('T')[1].split(':');
        if (timeParts.length >= 2) {
          return `${timeParts[0]}:${timeParts[1]}`;
        }
      }
      
      // 2. Format heure simple
      if (typeof dateTime === 'string' && dateTime.includes(':') && !dateTime.includes('T')) {
        const parts = dateTime.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }
      
      // 3. Dernier recours
      const date = new Date(dateTime);
      if (!isNaN(date.getTime())) {
        const isoString = date.toISOString();
        const timePart = isoString.split('T')[1].substring(0, 5);
        return timePart;
      }
      
      return '09:00'; // Valeur par défaut
    } catch (error) {
      console.error("Erreur d'extraction d'heure:", error);
      return '09:00'; // Valeur par défaut
    }
  };

  // Formater les dates pour l'affichage
  const formatDateRange = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
    const start = new Date(newOffer.startDate).toLocaleDateString('fr-CA', options);
    const end = new Date(newOffer.endDate).toLocaleDateString('fr-CA', options);
  
    return newOffer.startDate === newOffer.endDate
      ? `Le ${start}`
      : `Du ${start} au ${end}`;
  };
  

  // Soumission du formulaire avec validation

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
      .map(([key]) => key);
  
    if (emptyFields.length > 0) {
      alert(`Veuillez remplir tous les champs obligatoires avant de publier l'offre: ${emptyFields.join(', ')}`);
      return;
    }
  
    const coordinates = newOffer.coordinates || { lat: 45.2538, lng: -74.1334 };
  
    const calculateDuration = (start, end) => {
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      return (endH + endM / 60) - (startH + startM / 60);
    };
  
    if (!newOffer.startDate || !newOffer.startTime || !newOffer.endTime) {
      alert("Heures ou dates manquantes — impossible de soumettre l'offre.");
      return;
    }
  
    // Format heure comme string HH:MM:SS pour éviter les conversions timezone
    const heureDebutDatetime = newOffer.startTime + ':00';
    const heureFinDatetime = newOffer.endTime + ':00';
  
    const offerPayload = {
      titre: newOffer.title,
      descript: newOffer.description,
      type_professionnel: newOffer.profession,
      date_mission: newOffer.startDate,
      date_debut: newOffer.startDate,  
      date_fin: newOffer.endDate, 
      heure_debut: heureDebutDatetime,
      heure_fin: heureFinDatetime,
      duree_heures: calculateDuration(newOffer.startTime, newOffer.endTime),
      remuneration: parseFloat(newOffer.compensation),
      est_urgent: false,
      statut: 'pending',
      competences_requises: newOffer.requirements,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      adresse_complete: newOffer.location,
      date_modification: new Date().toISOString()
    };
  
    try {
      if (id) {
        await updateOffer(id, offerPayload);
        alert("✅ Offre mise à jour avec succès !");
      } else {
        await createOffer(offerPayload);
        alert("✅ Offre créée avec succès !");
      }
  
      navigate('/clinique-offres');
    } catch (error) {
      console.error("❌ Erreur lors de la soumission de l'offre :", error);
      alert("Erreur lors de la publication de l'offre. Veuillez réessayer.");
    }
  };

  const initializeAutocomplete = () => {
    if (addressRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['ca'] } // adapte à ta localisation
      });
  
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address && place.geometry) {
          setNewOffer((prev) => ({
            ...prev,
            location: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          }));
        }
      });
    }
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDpqnb3oy6kW0e3vybt6foVnTWF_9_NA30&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
    } else {
      initializeAutocomplete();
    }
  }, []);
  

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
              <p><strong>Horaires:</strong> {formatHeure(newOffer.startTime)} à {formatHeure(newOffer.endTime)}</p>

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
              <p>{newOffer.compensation ? `${newOffer.compensation} $ CAD` : "Non spécifiée"}</p>
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
                    ref={addressRef}
                    required
                  />
                  <small className="help-text">
                    L'adresse de votre clinique est pré-remplie. Vous pouvez la modifier si nécessaire.
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
                    placeholder="Ex: 350$/jour, pourcentage sur le chiffre d'affaires..."
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