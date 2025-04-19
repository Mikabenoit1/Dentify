import React, { useState, useEffect, useRef } from 'react';
import '../styles/MaClinique.css';
import { apiFetch, FILE_BASE_URL, API_BASE_URL  } from '../lib/apiFetch'; 
import {
  fetchClinicProfile,
  updateClinicProfile,
  uploadClinicLogo,
  uploadClinicPhoto
} from '../lib/clinicApi';

const MaClinique = () => {
  // État pour la clinique avec valeurs par défaut
  const [clinique, setClinique] = useState({
    nom: '',
    adresse: '',
    adresse_complete: '',
    ville: '',
    codePostal: '',
    telephone: '',
    email: '',
    siteWeb: '',
    description: '',
    specialites: [],
    services: [],
    equipement: [],
    equipe: [],
    logo: '',
    photos: [],
    coordinates: {
      lat: 45.2538, 
      lng: -74.1334
    },
    horaires: {
      lundi: { ouvert: true, debut: '09:00', fin: '17:00' },
      mardi: { ouvert: true, debut: '09:00', fin: '17:00' },
      mercredi: { ouvert: true, debut: '09:00', fin: '17:00' },
      jeudi: { ouvert: true, debut: '09:00', fin: '17:00' },
      vendredi: { ouvert: true, debut: '09:00', fin: '17:00' },
      samedi: { ouvert: false, debut: '09:00', fin: '17:00' },
      dimanche: { ouvert: false, debut: '09:00', fin: '17:00' }
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // État pour le mode édition
  const [editMode, setEditMode] = useState(false);
  
  // État pour stocker les modifications pendant l'édition
  const [editedClinique, setEditedClinique] = useState(null);
  
  // États pour les champs de type liste
  const [newService, setNewService] = useState("");
  const [newEquipement, setNewEquipement] = useState("");
  const [newSpecialite, setNewSpecialite] = useState("");
  const [newLangue, setNewLangue] = useState("");
  const [newAssurance, setNewAssurance] = useState("");
  
  // État pour le nouvel employé
  const [newEmploye, setNewEmploye] = useState({
    nom: "",
    poste: "",
    specialite: ""
  });

  // Référence pour l'input d'adresse
  const addressInputRef = useRef(null);

  // Charger les données de la clinique depuis le backend
  useEffect(() => {
    const loadClinicProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchClinicProfile();
        console.log("Données récupérées:", data);
        
        // Fusionner avec les valeurs par défaut pour s'assurer que tous les champs existent
        setClinique(prevState => ({ ...prevState, ...data }));
        setEditedClinique(prevState => ({ ...prevState, ...data }));
        setDataLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du profil de la clinique:", err);
        // Ne pas définir d'erreur ici, juste utiliser les valeurs par défaut
        setLoading(false);
        setDataLoaded(true); // Considérer les données comme chargées même avec l'erreur
      }
    };
  
    loadClinicProfile();
  }, []);

  // Charger Google Maps API
  useEffect(() => {
    if (!window.google && editMode) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      googleMapsScript.defer = true;
      window.document.body.appendChild(googleMapsScript);
      
      googleMapsScript.onload = () => {
        initializeAutocomplete();
      };
      
      return () => {
        // Supprimer le script lors du démontage du composant
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src.includes('maps.googleapis.com')) {
            scripts[i].parentNode.removeChild(scripts[i]);
            break;
          }
        }
      };
    } else if (window.google && editMode) {
      initializeAutocomplete();
    }
  }, [editMode]);

  // Initialiser l'autocomplétion de l'adresse
  const initializeAutocomplete = () => {
    if (!addressInputRef.current || !window.google) return;
    
    const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
      types: ['address'],
      componentRestrictions: { country: ['ca'] } // Restreindre au Canada
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("Aucun détail disponible pour cette adresse");
        return;
      }
      
      // Adresse complète
      const formattedAddress = place.formatted_address;
      
      // Extraire les composants de l'adresse
      let streetNumber = '';
      let route = '';
      let locality = ''; // ville
      let postalCode = '';
      let administrativeArea = ''; // province
      
      for (const component of place.address_components) {
        const componentType = component.types[0];
        
        switch (componentType) {
          case "street_number":
            streetNumber = component.long_name;
            break;
          case "route":
            route = component.long_name;
            break;
          case "locality":
            locality = component.long_name;
            break;
          case "postal_code":
            postalCode = component.long_name;
            break;
          case "administrative_area_level_1":
            administrativeArea = component.long_name;
            break;
        }
      }
      
      // Construire l'adresse de rue
      const streetAddress = streetNumber 
        ? `${streetNumber} ${route}` 
        : route;
      
      setEditedClinique(prev => ({
        ...prev,
        adresse: streetAddress,
        ville: locality,
        codePostal: postalCode,
        province: administrativeArea,
        adresse_complete: formattedAddress,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }));
    });
  };

  // Gestion des modifications des champs texte
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion des champs imbriqués (si nécessaire)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedClinique({
        ...editedClinique,
        [parent]: {
          ...editedClinique[parent],
          [child]: value
        }
      });
    } else {
      setEditedClinique({
        ...editedClinique,
        [name]: value
      });
    }
  };

  // Gestion des modifications des horaires
  const handleHoraireChange = (jour, field, value) => {
    setEditedClinique({
      ...editedClinique,
      horaires: {
        ...editedClinique.horaires,
        [jour]: {
          ...editedClinique.horaires[jour],
          [field]: field === 'ouvert' ? value === "true" : value
        }
      }
    });
  };

  // Gestion des listes (services, équipement, etc.)
  const handleAddItem = (field, value, resetFunc) => {
    if (value.trim()) {
      setEditedClinique({
        ...editedClinique,
        [field]: [...(editedClinique[field] || []), value.trim()]
      });
      resetFunc("");
    }
  };

  const handleRemoveItem = (field, index) => {
    if (editedClinique[field]) {
      const newArray = [...editedClinique[field]];
      newArray.splice(index, 1);
      setEditedClinique({
        ...editedClinique,
        [field]: newArray
      });
    }
  };

  // Gestion de l'équipe
  const handleEmployeInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmploye({
      ...newEmploye,
      [name]: value
    });
  };

  const handleAddEmploye = () => {
    if (newEmploye.nom.trim() && newEmploye.poste.trim()) {
      setEditedClinique({
        ...editedClinique,
        equipe: [...(editedClinique.equipe || []), {...newEmploye}]
      });
      setNewEmploye({
        nom: "",
        poste: "",
        specialite: ""
      });
    }
  };

  const handleRemoveEmploye = (index) => {
    if (editedClinique.equipe) {
      const newEquipe = [...editedClinique.equipe];
      newEquipe.splice(index, 1);
      setEditedClinique({
        ...editedClinique,
        equipe: newEquipe
      });
    }
  };

  // Activation du mode édition
  const handleEdit = () => {
    setEditMode(true);
    setEditedClinique({...clinique});
  };

  // Sauvegarde des modifications
  const handleSave = async () => {
    try {
      setLoading(true);
  
      // Préparer une copie des données à envoyer
      const dataToSend = { ...editedClinique };
      
      // Nettoyer les URL pour le logo (retirer FILE_BASE_URL)
      if (dataToSend.logo && dataToSend.logo.startsWith(FILE_BASE_URL)) {
        dataToSend.logo = dataToSend.logo.replace(FILE_BASE_URL, '');
      }
      
      // Nettoyer les URL pour les photos (retirer FILE_BASE_URL)
      if (Array.isArray(dataToSend.photos)) {
        dataToSend.photos = dataToSend.photos.map(photo => {
          return photo.startsWith(FILE_BASE_URL) ? photo.replace(FILE_BASE_URL, '') : photo;
        });
      }
  
      console.log("📝 Données envoyées à updateClinicProfile:", dataToSend);
  
      // Envoyer les données mises à jour
      await updateClinicProfile(dataToSend);
  
      // Mettre à jour l'état local
      setClinique({ ...editedClinique });
      setEditMode(false);
      setLoading(false);
  
      // Notification succès
      alert("Profil de la clinique mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setLoading(false);
      alert("Erreur lors de la mise à jour du profil de la clinique. Veuillez réessayer.");
    }
  };

  // Annulation des modifications
  const handleCancel = () => {
    setEditMode(false);
    setEditedClinique({...clinique});
    setNewService("");
    setNewEquipement("");
    setNewSpecialite("");
    setNewLangue("");
    setNewAssurance("");
    setNewEmploye({
      nom: "",
      poste: "",
      specialite: ""
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('logo', file);
  
        const response = await uploadClinicLogo(formData);
        const logoUrl = `${FILE_BASE_URL}${response.logoUrl}`; // ← important
        console.log("📸 Logo uploadé →", logoUrl);
  
        setEditedClinique((prev) => ({
          ...prev,
          logo: logoUrl
        }));
        
      } catch (err) {
        alert("Erreur lors de l'upload du logo. Veuillez réessayer.");
        console.error("Erreur lors de l'upload du logo:", err);
      }
    }
  };
  
  // Gestion du téléchargement des photos
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        
        console.log("Téléchargement de la photo en cours...");
        
        const response = await uploadClinicPhoto(formData);
        console.log("Réponse du serveur:", response);
        
        const fullPhotoUrl = `${FILE_BASE_URL}${response.photoUrl}`;
        console.log("URL complète de la photo:", fullPhotoUrl);
        
        setEditedClinique((prev) => {
          const newPhotos = [...(prev.photos || []), fullPhotoUrl];
          console.log("Liste des photos mise à jour:", newPhotos);
          return {
            ...prev,
            photos: newPhotos
          };
        });
        
      } catch (err) {
        alert("Erreur lors de l'upload de la photo. Veuillez réessayer.");
        console.error("Erreur lors de l'upload de la photo:", err);
      }
    }
  };
  
  const handleRemovePhoto = (index) => {
    if (editedClinique.photos) {
      const newPhotos = [...editedClinique.photos];
      newPhotos.splice(index, 1);
      setEditedClinique({
        ...editedClinique,
        photos: newPhotos
      });
    }
  };

  // Afficher un message de chargement
  if (loading && !dataLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du profil de la clinique...</p>
      </div>
    );
  }

  return (
    <div className={`maclinique-container ${editMode ? 'edit-mode' : ''}`}>
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="logo-container">
            {clinique.logo ? (
              <img src={clinique.logo} alt="Logo de la clinique" className="clinic-logo" />
            ) : (
              <div className="placeholder-logo">
                <i className="fas fa-tooth"></i>
              </div>
            )}
          </div>
          <h1>{clinique.nom || 'Ma Clinique'}</h1>
        </div>
        {!editMode ? (
          <button className="edit-profile-button" onClick={handleEdit}>
            <i className="fas fa-edit"></i> Modifier le profil
          </button>
        ) : (
          <div className="edit-actions">
            <button className="cancel-button" onClick={handleCancel}>
              <i className="fas fa-times"></i> Annuler
            </button>
            <button className="save-button" onClick={handleSave}>
              <i className="fas fa-save"></i> Enregistrer
            </button>
          </div>
        )}
      </div>

      <div className="profile-content">
        {/* Section Informations Générales */}
        <div className="profile-section">
          <h2><i className="fas fa-info-circle"></i> Informations générales</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="info-grid">
                <div className="info-column">
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-clinic-medical"></i> Nom :</span>
                    <span className="info-value">{clinique.nom || 'Non spécifié'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-map-marker-alt"></i> Adresse :</span>
                    <span className="info-value">
                      {clinique.adresse_complete || clinique.adresse ? 
                        `${clinique.adresse_complete || clinique.adresse}, ${clinique.codePostal || ''} ${clinique.ville || ''}` : 
                        'Non spécifiée'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-phone"></i> Téléphone :</span>
                    <span className="info-value">{clinique.telephone || 'Non spécifié'}</span>
                  </div>
                </div>
                <div className="info-column">
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-envelope"></i> Email :</span>
                    <span className="info-value">{clinique.email || 'Non spécifié'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-globe"></i> Site web :</span>
                    <span className="info-value">{clinique.siteWeb || 'Non spécifié'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-star"></i> Spécialités :</span>
                    <span className="info-value">
                      {clinique.specialites?.length > 0 ? 
                        clinique.specialites.join(", ") : 
                        'Non spécifiées'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                {/* Logo upload section */}
                <div className="logo-upload-section">
                  <div className="current-logo">
                    {editedClinique.logo ? (
                      <img src={editedClinique.logo} alt="Logo de la clinique" className="logo-preview" />
                    ) : (
                      <div className="placeholder-logo">
                        <i className="fas fa-tooth"></i>
                      </div>
                    )}
                  </div>
                  <div className="logo-upload">
                    <label htmlFor="logo-upload" className="upload-button">
                      <i className="fas fa-upload"></i> Modifier le logo
                    </label>
                    <input 
                      type="file" 
                      id="logo-upload" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nom"><i className="fas fa-clinic-medical"></i> Nom de la clinique</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={editedClinique.nom || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="adresse_complete"><i className="fas fa-map-marker-alt"></i> Adresse complète</label>
                    <input
                      type="text"
                      id="adresse_complete"
                      name="adresse_complete"
                      value={editedClinique.adresse_complete || ''}
                      onChange={handleInputChange}
                      ref={addressInputRef}
                      placeholder="Entrez l'adresse de votre clinique"
                    />
                    <small className="help-text">
                      Commencez à taper votre adresse et sélectionnez une suggestion dans la liste déroulante
                    </small>
                  </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="codePostal">Code postal</label>
                    <input
                      type="text"
                      id="codePostal"
                      name="codePostal"
                      value={editedClinique.codePostal || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ville">Ville</label>
                    <input
                      type="text"
                      id="ville"
                      name="ville"
                      value={editedClinique.ville || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telephone"><i className="fas fa-phone"></i> Téléphone</label>
                    <input
                      type="text"
                      id="telephone"
                      name="telephone"
                      value={editedClinique.telephone || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedClinique.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="siteWeb"><i className="fas fa-globe"></i> Site web</label>
                  <input
                    type="text"
                    id="siteWeb"
                    name="siteWeb"
                    value={editedClinique.siteWeb || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Spécialités */}
                <div className="form-group">
                  <label><i className="fas fa-star"></i> Spécialités</label>
                  <div className="tags-container">
                    {editedClinique.specialites?.map((specialite, index) => (
                      <div key={index} className="tag">
                        <span>{specialite}</span>
                        <button type="button" onClick={() => handleRemoveItem('specialites', index)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-tag-form">
                    <input
                      type="text"
                      value={newSpecialite}
                      onChange={(e) => setNewSpecialite(e.target.value)}
                      placeholder="Ajouter une spécialité..."
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddItem('specialites', newSpecialite, setNewSpecialite)}
                      disabled={!newSpecialite.trim()}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Description */}
        <div className="profile-section">
          <h2><i className="fas fa-align-left"></i> Description</h2>
          <div className="section-content">
            {!editMode ? (
              <p className="description-text">{clinique.description || 'Aucune description disponible.'}</p>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="description">Description de la clinique</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedClinique.description || ''}
                    onChange={handleInputChange}
                    rows="5"
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Horaires */}
        <div className="profile-section">
          <h2><i className="fas fa-clock"></i> Horaires d'ouverture</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="horaires-grid">
                {clinique.horaires ? (
                  Object.entries(clinique.horaires).map(([jour, horaire]) => (
                    <div key={jour} className="horaire-item">
                      <span className="jour">{jour.charAt(0).toUpperCase() + jour.slice(1)}</span>
                      <span className="heures">
                        {horaire.ouvert ? `${horaire.debut} - ${horaire.fin}` : 'Fermé'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>Aucun horaire défini.</p>
                )}
              </div>
            ) : (
              <div className="edit-form">
                <div className="horaires-edit-grid">
                  {editedClinique.horaires ? (
                    Object.entries(editedClinique.horaires).map(([jour, horaire]) => (
                      <div key={jour} className="horaire-edit-item">
                        <div className="jour-label">
                          {jour.charAt(0).toUpperCase() + jour.slice(1)}
                        </div>
                        <div className="horaire-inputs">
                          <select
                            value={horaire.ouvert.toString()}
                            onChange={(e) => handleHoraireChange(jour, 'ouvert', e.target.value)}
                          >
                            <option value="true">Ouvert</option>
                            <option value="false">Fermé</option>
                          </select>
                          {horaire.ouvert && (
                            <>
                              <input
                                type="time"
                                value={horaire.debut}
                                onChange={(e) => handleHoraireChange(jour, 'debut', e.target.value)}
                                disabled={!horaire.ouvert}
                              />
                              <span>-</span>
                              <input
                                type="time"
                                value={horaire.fin}
                                onChange={(e) => handleHoraireChange(jour, 'fin', e.target.value)}
                                disabled={!horaire.ouvert}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucun horaire défini. Veuillez contacter l'administrateur.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Services */}
        <div className="profile-section">
          <h2><i className="fas fa-hand-holding-medical"></i> Services proposés</h2>
          <div className="section-content">
            {!editMode ? (
              <ul className="services-list">
                {clinique.services?.length > 0 ? (
                  clinique.services.map((service, index) => (
                    <li key={index} className="service-item">
                      <i className="fas fa-check-circle"></i> {service}
                    </li>
                  ))
                ) : (
                  <p>Aucun service défini.</p>
                )}
              </ul>
            ) : (
              <div className="edit-form">
                <div className="edit-list-container">
                  <ul className="edit-list">
                    {editedClinique.services?.map((service, index) => (
                      <li key={index} className="edit-list-item">
                        <span>{service}</span>
                        <button 
                          type="button" 
                          className="remove-item" 
                          onClick={() => handleRemoveItem('services', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="add-item-form">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ajouter un service..."
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddItem('services', newService, setNewService)}
                      disabled={!newService.trim()}
                    >
                      <i className="fas fa-plus"></i> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Équipement */}
        <div className="profile-section">
          <h2><i className="fas fa-toolbox"></i> Équipement</h2>
          <div className="section-content">
            {!editMode ? (
              <ul className="equipment-list">
                {clinique.equipement?.length > 0 ? (
                  clinique.equipement.map((item, index) => (
                    <li key={index} className="equipment-item">
                      <i className="fas fa-cog"></i> {item}
                    </li>
                  ))
                ) : (
                  <p>Aucun équipement défini.</p>
                )}
              </ul>
            ) : (
              <div className="edit-form">
                <div className="edit-list-container">
                  <ul className="edit-list">
                    {editedClinique.equipement?.map((item, index) => (
                      <li key={index} className="edit-list-item">
                        <span>{item}</span>
                        <button 
                          type="button" 
                          className="remove-item" 
                          onClick={() => handleRemoveItem('equipement', index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="add-item-form">
                    <input
type="text"
value={newEquipement}
onChange={(e) => setNewEquipement(e.target.value)}
placeholder="Ajouter un équipement..."
/>
<button 
type="button" 
onClick={() => handleAddItem('equipement', newEquipement, setNewEquipement)}
disabled={!newEquipement.trim()}
>
<i className="fas fa-plus"></i> Ajouter
</button>
</div>
</div>
</div>
)}
</div>
</div>

{/* Section Équipe */}
<div className="profile-section">
<h2><i className="fas fa-users"></i> Notre équipe</h2>
<div className="section-content">
{!editMode ? (
<div className="team-grid">
{clinique.equipe?.length > 0 ? (
clinique.equipe.map((membre, index) => (
<div key={index} className="team-card">
<div className="team-icon">
  <i className="fas fa-user-md"></i>
</div>
<div className="team-info">
  <h3>{membre.nom}</h3>
  <p className="team-role">{membre.poste}</p>
  {membre.specialite && <p className="team-specialty">{membre.specialite}</p>}
</div>
</div>
))
) : (
<p>Aucun membre d'équipe défini.</p>
)}
</div>
) : (
<div className="edit-form">
<div className="team-edit-container">
{editedClinique.equipe?.map((membre, index) => (
<div key={index} className="team-edit-item">
<div className="team-edit-info">
  <span className="team-name">{membre.nom}</span>
  <span className="team-role">{membre.poste}</span>
  {membre.specialite && <span className="team-specialty">{membre.specialite}</span>}
</div>
<button 
  type="button" 
  className="remove-item" 
  onClick={() => handleRemoveEmploye(index)}
>
  <i className="fas fa-times"></i>
</button>
</div>
))}

<div className="add-team-form">
<h4>Ajouter un membre de l'équipe</h4>
<div className="form-row">
<div className="form-group">
  <label htmlFor="employe-nom">Nom</label>
  <input
    type="text"
    id="employe-nom"
    name="nom"
    value={newEmploye.nom}
    onChange={handleEmployeInputChange}
    placeholder="Nom du professionnel"
  />
</div>
<div className="form-group">
  <label htmlFor="employe-poste">Poste</label>
  <input
    type="text"
    id="employe-poste"
    name="poste"
    value={newEmploye.poste}
    onChange={handleEmployeInputChange}
    placeholder="Poste occupé"
  />
</div>
</div>
<div className="form-group">
<label htmlFor="employe-specialite">Spécialité (optionnel)</label>
<input
  type="text"
  id="employe-specialite"
  name="specialite"
  value={newEmploye.specialite}
  onChange={handleEmployeInputChange}
  placeholder="Spécialité (si applicable)"
/>
</div>
<button 
type="button" 
className="add-team-button"
onClick={handleAddEmploye}
disabled={!newEmploye.nom.trim() || !newEmploye.poste.trim()}
>
<i className="fas fa-plus"></i> Ajouter à l'équipe
</button>
</div>
</div>
</div>
)}
</div>
</div>

{/* Section Galerie */}
<div className="profile-section">
<h2><i className="fas fa-images"></i> Galerie photos</h2>
<div className="section-content">
{!editMode ? (
<div className="gallery-grid">
{console.log("Photos URLs:", clinique.photos)}
{clinique.photos?.length > 0 ? (
clinique.photos.map((photo, index) => (
<div key={index} className="gallery-item">
<img src={photo} alt={`Cabinet ${index + 1}`} />
</div>
))
) : (
<p>Aucune photo disponible.</p>
)}
</div>
) : (
<div className="edit-form">
<div className="gallery-edit-container">
<div className="gallery-edit-grid">
{editedClinique.photos?.map((photo, index) => (
<div key={index} className="gallery-edit-item">
  <img src={photo} alt={`Cabinet ${index + 1}`} />
  <button 
    type="button" 
    className="remove-photo" 
    onClick={() => handleRemovePhoto(index)}
  >
    <i className="fas fa-trash"></i>
  </button>
</div>
))}
<div className="add-photo-item">
<label htmlFor="photo-upload" className="photo-upload-label">
  <i className="fas fa-plus"></i>
  <span>Ajouter une photo</span>
</label>
<input 
  type="file" 
  id="photo-upload" 
  accept="image/*" 
  onChange={handlePhotoUpload}
  style={{ display: 'none' }}
/>
</div>
</div>
</div>
</div>
)}
</div>
</div>
</div>

{/* Overlay de chargement pendant les opérations */}
{loading && (
<div className="loading-overlay">
<div className="loading-spinner"></div>
</div>
)}
</div>
);
};

export default MaClinique;