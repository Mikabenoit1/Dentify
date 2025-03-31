import React, { useState, useEffect, useRef } from 'react';
import '../styles/MonCompte.css';

const MonCompte = () => {
  // Référence pour faire défiler vers les notifications
  const notificationRef = useRef(null);
  const addressInputRef = useRef(null);
  
  // État pour la notification
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  // État pour le mode édition
  const [editMode, setEditMode] = useState(false);
  
  // État pour les informations du profil
  const [profile, setProfile] = useState({
    nom: "Dr. Martin Dupont",
    profession: "dentiste",
    email: "martin.dupont@email.com",
    telephone: "06 12 34 56 78",
    description: "Dentiste généraliste avec 8 ans d'expérience. Spécialisé en dentisterie restauratrice et esthétique.",
    experience: {
      annees: 8,
      specialites: ["Dentisterie générale", "Restauratrice", "Esthétique"],
    },
    disponibilite: {
      debut: "2023-07-01",
      fin: "2023-08-31",
      jours: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
      disponibleImmediatement: true
    },
    tarifJournalier: "450",
    mobilite: {
      rayon: 50,
      vehicule: true,
      regions: ["Île-de-France", "Normandie"],
      adressePrincipale: "15 Rue du Docteur Roux, 75015 Paris",
      coordinates: {
        lat: 48.8417,
        lng: 2.3093
      }
    },
    competences: ["Implantologie", "Prothèses", "Endodontie", "Pédodontie"],
    langues: ["Français", "Anglais", "Espagnol"],
    educations: [
      {
        diplome: "Doctorat en Chirurgie Dentaire",
        etablissement: "Université Paris Descartes",
        annee: "2015"
      },
      {
        diplome: "DU d'Implantologie",
        etablissement: "Université Paris Diderot",
        annee: "2017"
      }
    ],
    experiences: [
      {
        poste: "Dentiste",
        etablissement: "Cabinet Dentaire Central",
        lieu: "Paris, France",
        debut: "2018-09",
        fin: "Present",
        description: "Dentisterie générale et implantologie."
      },
      {
        poste: "Dentiste assistant",
        etablissement: "Clinique Dentaire Moderne",
        lieu: "Lyon, France",
        debut: "2015-10",
        fin: "2018-08",
        description: "Dentisterie esthétique et pédiatrique."
      }
    ],
    documents: {
      cv: "cv_martin_dupont.pdf",
      diplome: "diplome_chirurgie_dentaire.pdf",
      inscription: "inscription_ordre_dentistes.pdf"
    },
    photo: "/assets/img/profile_placeholder.jpg"
  });
  
  // État pour stocker les modifications en cours
  const [editedProfile, setEditedProfile] = useState({...profile});
  
  // États pour les champs de type liste
  const [newSpecialite, setNewSpecialite] = useState("");
  const [newCompetence, setNewCompetence] = useState("");
  const [newLangue, setNewLangue] = useState("");
  const [newRegion, setNewRegion] = useState("");
  
  // États pour les nouvelles expériences et éducations
  const [newEducation, setNewEducation] = useState({
    diplome: "",
    etablissement: "",
    annee: ""
  });
  
  const [newExperience, setNewExperience] = useState({
    poste: "",
    etablissement: "",
    lieu: "",
    debut: "",
    fin: "",
    description: ""
  });

  // Charger Google Maps API
  useEffect(() => {
    if (!window.google) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=VOTRE_CLE_API_GOOGLE_MAPS&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      window.document.body.appendChild(googleMapsScript);
      
      googleMapsScript.onload = () => {
        if (editMode) {
          initializeAutocomplete();
        }
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
    } else if (editMode) {
      initializeAutocomplete();
    }
  }, [editMode]);

  // Initialiser l'autocomplétion de l'adresse
  const initializeAutocomplete = () => {
    const input = document.getElementById("mobilite.adressePrincipale");
    if (input && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: ['fr'] } // Limiter à la France
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        
        // Mise à jour de l'adresse et des coordonnées
        setEditedProfile(prev => ({
          ...prev,
          mobilite: {
            ...prev.mobilite,
            adressePrincipale: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          }
        }));
      });
    }
  };
  
  // Fonction pour activer le mode édition
  const handleEdit = () => {
    setEditMode(true);
    setEditedProfile({...profile});
    
    // Initialiser l'autocomplétion après que le DOM soit mis à jour
    setTimeout(() => {
      initializeAutocomplete();
    }, 100);
  };
  
  // Fonction pour annuler les modifications
  const handleCancel = () => {
    setEditMode(false);
    setNewSpecialite("");
    setNewCompetence("");
    setNewLangue("");
    setNewRegion("");
    setNewEducation({
      diplome: "",
      etablissement: "",
      annee: ""
    });
    setNewExperience({
      poste: "",
      etablissement: "",
      lieu: "",
      debut: "",
      fin: "",
      description: ""
    });
  };
  
  // Fonction pour afficher une notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Faire défiler vers la notification si nécessaire
    if (notificationRef.current) {
      notificationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Masquer la notification après 5 secondes
    setTimeout(() => {
      setNotification({
        show: false,
        message: '',
        type
      });
    }, 5000);
  };
  
  // Fonction pour valider les données du profil
  const validateProfile = () => {
    // Validation des champs obligatoires
    if (!editedProfile.nom.trim()) {
      showNotification("Veuillez entrer votre nom complet", "error");
      return false;
    }
    
    if (!editedProfile.email.trim()) {
      showNotification("Veuillez entrer votre adresse email", "error");
      return false;
    }
    
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedProfile.email)) {
      showNotification("Veuillez entrer une adresse email valide", "error");
      return false;
    }
    
    // Validation des dates de disponibilité
    if (new Date(editedProfile.disponibilite.debut) > new Date(editedProfile.disponibilite.fin)) {
      showNotification("La date de début doit être antérieure à la date de fin", "error");
      return false;
    }
    
    // Validation du tarif journalier
    if (parseInt(editedProfile.tarifJournalier) <= 0) {
      showNotification("Veuillez entrer un tarif journalier valide", "error");
      return false;
    }
    
    // Validation de l'adresse et des coordonnées
    if (!editedProfile.mobilite.adressePrincipale || !editedProfile.mobilite.coordinates) {
      showNotification("Veuillez sélectionner une adresse valide dans les suggestions", "error");
      return false;
    }
    
    return true;
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSave = () => {
    // Valider les données avant de sauvegarder
    if (!validateProfile()) {
      return;
    }
    
    // Dans un environnement réel, on enverrait ici les données au serveur via une API
    // Simuler un appel API
    setTimeout(() => {
      setProfile({...editedProfile});
      setEditMode(false);
      
      // Réinitialiser les états des nouveaux éléments
      setNewSpecialite("");
      setNewCompetence("");
      setNewLangue("");
      setNewRegion("");
      setNewEducation({
        diplome: "",
        etablissement: "",
        annee: ""
      });
      setNewExperience({
        poste: "",
        etablissement: "",
        lieu: "",
        debut: "",
        fin: "",
        description: ""
      });
      
      // Afficher une notification de succès
      showNotification("Profil mis à jour avec succès !", "success");
    }, 1000);
  };
  
  // Gestion des changements d'input pour les champs simples
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion des champs imbriqués
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedProfile({
        ...editedProfile,
        [parent]: {
          ...editedProfile[parent],
          [child]: value
        }
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        [name]: value
      });
    }
  };
  
  // Gestion des changements pour les jours de disponibilité (checkboxes)
  const handleDayToggle = (day) => {
    const currentDays = [...editedProfile.disponibilite.jours];
    
    if (currentDays.includes(day)) {
      // Enlever le jour s'il est déjà présent
      const updatedDays = currentDays.filter(d => d !== day);
      setEditedProfile({
        ...editedProfile,
        disponibilite: {
          ...editedProfile.disponibilite,
          jours: updatedDays
        }
      });
    } else {
      // Ajouter le jour s'il n'est pas présent
      setEditedProfile({
        ...editedProfile,
        disponibilite: {
          ...editedProfile.disponibilite,
          jours: [...currentDays, day]
        }
      });
    }
  };
  
  // Gestion de la disponibilité immédiate
  const handleDisponibiliteImmediate = (e) => {
    setEditedProfile({
      ...editedProfile,
      disponibilite: {
        ...editedProfile.disponibilite,
        disponibleImmediatement: e.target.checked
      }
    });
  };
  
  // Gestion du véhicule
  const handleVehicule = (e) => {
    setEditedProfile({
      ...editedProfile,
      mobilite: {
        ...editedProfile.mobilite,
        vehicule: e.target.checked
      }
    });
  };
  
  // Ajouter un nouvel élément à une liste
  const handleAddItem = (field, value, resetFunc) => {
    if (value.trim()) {
      // Gérer les champs imbriqués
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setEditedProfile({
          ...editedProfile,
          [parent]: {
            ...editedProfile[parent],
            [child]: [...editedProfile[parent][child], value.trim()]
          }
        });
      } else {
        setEditedProfile({
          ...editedProfile,
          [field]: [...editedProfile[field], value.trim()]
        });
      }
      resetFunc("");
    }
  };
  
  // Supprimer un élément d'une liste
  const handleRemoveItem = (field, index) => {
    // Gérer les champs imbriqués
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const newArray = [...editedProfile[parent][child]];
      newArray.splice(index, 1);
      setEditedProfile({
        ...editedProfile,
        [parent]: {
          ...editedProfile[parent],
          [child]: newArray
        }
      });
    } else {
      const newArray = [...editedProfile[field]];
      newArray.splice(index, 1);
      setEditedProfile({
        ...editedProfile,
        [field]: newArray
      });
    }
  };
  
  // Gestion des changements pour les nouvelles éducations
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({
      ...newEducation,
      [name]: value
    });
  };
  
  // Ajouter une nouvelle éducation
  const handleAddEducation = () => {
    if (newEducation.diplome && newEducation.etablissement && newEducation.annee) {
      setEditedProfile({
        ...editedProfile,
        educations: [...editedProfile.educations, {...newEducation}]
      });
      setNewEducation({
        diplome: "",
        etablissement: "",
        annee: ""
      });
    }
  };
  
  // Supprimer une éducation
  const handleRemoveEducation = (index) => {
    const newEducations = [...editedProfile.educations];
    newEducations.splice(index, 1);
    setEditedProfile({
      ...editedProfile,
      educations: newEducations
    });
  };
  
  // Gestion des changements pour les nouvelles expériences
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience({
      ...newExperience,
      [name]: value
    });
  };
  
  // Ajouter une nouvelle expérience
  const handleAddExperience = () => {
    if (newExperience.poste && newExperience.etablissement && newExperience.debut) {
      setEditedProfile({
        ...editedProfile,
        experiences: [...editedProfile.experiences, {...newExperience}]
      });
      setNewExperience({
        poste: "",
        etablissement: "",
        lieu: "",
        debut: "",
        fin: "",
        description: ""
      });
    }
  };
  
  // Supprimer une expérience
  const handleRemoveExperience = (index) => {
    const newExperiences = [...editedProfile.experiences];
    newExperiences.splice(index, 1);
    setEditedProfile({
      ...editedProfile,
      experiences: newExperiences
    });
  };
  
  // Gestion du téléchargement de la photo
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dans un cas réel, ici on uploadrait l'image vers un serveur
      // Pour notre exemple, on va créer une URL locale
      const imageUrl = URL.createObjectURL(file);
      setEditedProfile({
        ...editedProfile,
        photo: imageUrl
      });
    }
  };
  
  // Gestion du téléchargement de documents
  const handleDocumentUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Le fichier est trop volumineux. Taille maximale: 5MB", "error");
        return;
      }
      
      // Vérification du type de fichier selon le documentType
      if (documentType === 'cv') {
        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
          showNotification("Format de CV non valide. Utilisez PDF ou DOC/DOCX", "error");
          return;
        }
      } else {
        // Pour les autres documents, accepter aussi les images
        const validTypes = [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png'
        ];
        
        if (!validTypes.includes(file.type)) {
          showNotification("Format de fichier non valide. Utilisez PDF, DOC/DOCX, JPG ou PNG", "error");
          return;
        }
      }
      
      // Pour un cas réel, on uploaderait vers un serveur
      // Ici on met juste à jour le nom du fichier
      setEditedProfile({
        ...editedProfile,
        documents: {
          ...editedProfile.documents,
          [documentType]: file.name
        }
      });
      
      showNotification(`Le document "${file.name}" a été téléchargé avec succès`, "success");
    }
  };
  
  // Fonction pour télécharger un document
  const handleDocumentDownload = (documentName) => {
    // Dans un environnement réel, cette fonction téléchargerait le fichier depuis le serveur
    // Ici, on affiche simplement une notification
    showNotification(`Téléchargement de "${documentName}" en cours...`, "info");
    
    // Simuler un temps de téléchargement
    setTimeout(() => {
      showNotification(`Le document "${documentName}" a été téléchargé avec succès`, "success");
    }, 1500);
  };
  
  // Formatter la date
  const formatDate = (dateString) => {
    if (dateString === "Present") return "Présent";
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    return `${month.toString().padStart(2, '0')}/${year}`;
  };
  
  return (
    <div className="mon-compte-container">
      <div className="profile-header">
        <div className="profile-title">
          <h1>Mon Profil Professionnel</h1>
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
        {/* Section informations personnelles */}
        <div className="profile-section">
          <h2><i className="fas fa-user-circle"></i> Informations personnelles</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="info-display">
                <div className="profile-photo-container">
                  <img 
                    src={profile.photo} 
                    alt={profile.nom} 
                    className="profile-photo" 
                  />
                </div>
                <div className="personal-info">
                  <h3>{profile.nom}</h3>
                  <p className="profession-tag">
                    {profile.profession === 'dentiste' ? 'Dentiste' : 
                     profile.profession === 'assistant' ? 'Assistant(e) dentaire' : 
                     'Hygiéniste dentaire'}
                  </p>
                  <p><i className="fas fa-envelope"></i> {profile.email}</p>
                  <p><i className="fas fa-phone"></i> {profile.telephone}</p>
                  <div className="profile-description">
                    <p>{profile.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="photo-upload-section">
                  <div className="current-photo">
                    <img 
                      src={editedProfile.photo} 
                      alt="Photo de profil" 
                      className="photo-preview" 
                    />
                  </div>
                  <div className="photo-upload">
                    <label htmlFor="photo-upload" className="upload-button">
                      <i className="fas fa-upload"></i> Modifier la photo
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom complet</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={editedProfile.nom}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="profession">Profession</label>
                    <select
                      id="profession"
                      name="profession"
                      value={editedProfile.profession}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="dentiste">Dentiste</option>
                      <option value="assistant">Assistant(e) dentaire</option>
                      <option value="hygieniste">Hygiéniste dentaire</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="telephone">Téléphone</label>
                    <input
                      type="text"
                      id="telephone"
                      name="telephone"
                      value={editedProfile.telephone}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description professionnelle</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedProfile.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Section mobilité */}
        <div className="profile-section">
          <h2><i className="fas fa-car"></i> Mobilité</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="mobility-display">
                <div className="mobility-info">
                  <p><strong>Adresse principale:</strong> {profile.mobilite.adressePrincipale}</p>
                  <p><strong>Rayon de mobilité:</strong> {profile.mobilite.rayon} km</p>
                  <p>
                    <strong>Véhicule personnel:</strong> 
                    {profile.mobilite.vehicule ? (
                      <span className="has-vehicle"><i className="fas fa-check-circle"></i> Oui</span>
                    ) : (
                      <span className="no-vehicle"><i className="fas fa-times-circle"></i> Non</span>
                    )}
                  </p>
                </div>
                
                <div className="regions-info">
                  <h4>Régions d'intervention</h4>
                  <div className="regions-container">
                    {profile.mobilite.regions.map((region, index) => (
                      <span key={index} className="region-chip">{region}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="mobilite.adressePrincipale">Adresse principale</label>
                  <input
                    type="text"
                    id="mobilite.adressePrincipale"
                    name="mobilite.adressePrincipale"
                    value={editedProfile.mobilite.adressePrincipale}
                    onChange={handleInputChange}
                    className="form-control address-autocomplete"
                    placeholder="Votre adresse principale"
                  />
                  <small className="help-text">
                    Commencez à taper votre adresse et sélectionnez une suggestion dans la liste déroulante
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="mobilite.rayon">Rayon de mobilité (km)</label>
                  <div className="range-with-value">
                    <input
                      type="range"
                      id="mobilite.rayon"
                      name="mobilite.rayon"
                      value={editedProfile.mobilite.rayon}
                      onChange={handleInputChange}
                      className="form-control range-input"
                      min="5"
                      max="200"
                      step="5"
                    />
                    <span className="range-value">{editedProfile.mobilite.rayon} km</span>
                  </div>
                  <small className="help-text">Distance maximale que vous êtes prêt à parcourir pour un remplacement</small>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="vehicule"
                      checked={editedProfile.mobilite.vehicule}
                      onChange={handleVehicule}
                    />
                    <label htmlFor="vehicule">Je dispose d'un véhicule personnel</label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Régions d'intervention</label>
                  <div className="tags-container">
                    {editedProfile.mobilite.regions.map((region, index) => (
                      <div key={index} className="tag">
                        <span>{region}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem('mobilite.regions', index)}
                          className="remove-tag"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-tag-form">
                    <input
                      type="text"
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      placeholder="Ajouter une région..."
                      className="form-control"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddItem('mobilite.regions', newRegion, setNewRegion)}
                      className="add-button"
                      disabled={!newRegion.trim()}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section disponibilité */}
        <div className="profile-section">
          <h2><i className="fas fa-calendar-alt"></i> Disponibilité</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="availability-display">
                <div className="availability-period">
                  <h4>Période de disponibilité</h4>
                  <p>Du {new Date(profile.disponibilite.debut).toLocaleDateString('fr-FR')} au {new Date(profile.disponibilite.fin).toLocaleDateString('fr-FR')}</p>
                  {profile.disponibilite.disponibleImmediatement && (
                    <p className="immediate-availability"><i className="fas fa-check-circle"></i> Disponible immédiatement</p>
                  )}
                </div>
                
                <div className="availability-days">
                  <h4>Jours disponibles</h4>
                  <div className="days-container">
                    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((day) => (
                      <div 
                        key={day} 
                        className={`day-chip ${profile.disponibilite.jours.includes(day) ? 'active' : 'inactive'}`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="daily-rate">
                  <h4>Tarif journalier</h4>
                  <p className="rate-amount">{profile.tarifJournalier} €</p>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="disponibilite.debut">Date de début</label>
                    <input
                      type="date"
                      id="disponibilite.debut"
                      name="disponibilite.debut"
                      value={editedProfile.disponibilite.debut}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="disponibilite.fin">Date de fin</label>
                    <input
                      type="date"
                      id="disponibilite.fin"
                      name="disponibilite.fin"
                      value={editedProfile.disponibilite.fin}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="form-group">
  <label>Jours disponibles</label>
  <div className="days-selection">
    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((day) => (
      <div key={day} className="day-toggle">
        <input
          type="checkbox"
          id={`day-${day}`}
          checked={editedProfile.disponibilite.jours.includes(day)}
          onChange={() => handleDayToggle(day)}
        />
        <label htmlFor={`day-${day}`}>
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </label>
      </div>
    ))}
  </div>
</div>

<div className="form-group">
  <div className="checkbox-group">
    <input
      type="checkbox"
      id="disponibiliteImmediate"
      checked={editedProfile.disponibilite.disponibleImmediatement}
      onChange={handleDisponibiliteImmediate}
    />
    <label htmlFor="disponibiliteImmediate">Disponible immédiatement</label>
  </div>
</div>

<div className="form-group">
  <label htmlFor="tarifJournalier">Tarif journalier (€)</label>
  <input
    type="number"
    id="tarifJournalier"
    name="tarifJournalier"
    value={editedProfile.tarifJournalier}
    onChange={handleInputChange}
    className="form-control"
    min="0"
  />
</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Section compétences */}
        <div className="profile-section">
          <h2><i className="fas fa-stethoscope"></i> Compétences</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="skills-display">
                <div className="skills-container">
                  {profile.competences.map((competence, index) => (
                    <span key={index} className="skill-chip">{competence}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Compétences professionnelles</label>
                  <div className="tags-container">
                    {editedProfile.competences.map((competence, index) => (
                      <div key={index} className="tag">
                        <span>{competence}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem('competences', index)}
                          className="remove-tag"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-tag-form">
                    <input
                      type="text"
                      value={newCompetence}
                      onChange={(e) => setNewCompetence(e.target.value)}
                      placeholder="Ajouter une compétence..."
                      className="form-control"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddItem('competences', newCompetence, setNewCompetence)}
                      className="add-button"
                      disabled={!newCompetence.trim()}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Section langues */}
        <div className="profile-section">
          <h2><i className="fas fa-language"></i> Langues</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="languages-display">
                <div className="languages-container">
                  {profile.langues.map((langue, index) => (
                    <span key={index} className="language-chip">{langue}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Langues maîtrisées</label>
                  <div className="tags-container">
                    {editedProfile.langues.map((langue, index) => (
                      <div key={index} className="tag">
                        <span>{langue}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem('langues', index)}
                          className="remove-tag"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-tag-form">
                    <input
                      type="text"
                      value={newLangue}
                      onChange={(e) => setNewLangue(e.target.value)}
                      placeholder="Ajouter une langue..."
                      className="form-control"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddItem('langues', newLangue, setNewLangue)}
                      className="add-button"
                      disabled={!newLangue.trim()}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Section documents */}
        <div className="profile-section">
          <h2><i className="fas fa-file-alt"></i> Documents</h2>
          <div className="section-content">
            {!editMode ? (
              <div className="documents-display">
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span className="document-name">CV</span>
                  <span className="document-filename">{profile.documents.cv}</span>
                  <button 
                    className="document-action"
                    onClick={() => handleDocumentDownload(profile.documents.cv)}
                  >
                    <i className="fas fa-download"></i> Télécharger
                  </button>
                </div>
                
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span className="document-name">Diplôme</span>
                  <span className="document-filename">{profile.documents.diplome}</span>
                  <button 
                    className="document-action"
                    onClick={() => handleDocumentDownload(profile.documents.diplome)}
                  >
                    <i className="fas fa-download"></i> Télécharger
                  </button>
                </div>
                
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span className="document-name">Inscription ordre professionnel</span>
                  <span className="document-filename">{profile.documents.inscription}</span>
                  <button 
                    className="document-action"
                    onClick={() => handleDocumentDownload(profile.documents.inscription)}
                  >
                    <i className="fas fa-download"></i> Télécharger
                  </button>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="document-edit-item">
                  <div className="document-info">
                    <span className="document-label">CV</span>
                    <span className="document-current">{editedProfile.documents.cv}</span>
                  </div>
                  <div className="document-upload">
                    <label htmlFor="cv-upload" className="upload-button">
                      <i className="fas fa-upload"></i> Modifier
                    </label>
                    <input 
                      type="file" 
                      id="cv-upload" 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => handleDocumentUpload(e, 'cv')}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                
                <div className="document-edit-item">
                  <div className="document-info">
                    <span className="document-label">Diplôme</span>
                    <span className="document-current">{editedProfile.documents.diplome}</span>
                  </div>
                  <div className="document-upload">
                    <label htmlFor="diplome-upload" className="upload-button">
                      <i className="fas fa-upload"></i> Modifier
                    </label>
                    <input 
                      type="file" 
                      id="diplome-upload" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                      onChange={(e) => handleDocumentUpload(e, 'diplome')}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                
                <div className="document-edit-item">
                  <div className="document-info">
                    <span className="document-label">Inscription ordre professionnel</span>
                    <span className="document-current">{editedProfile.documents.inscription}</span>
                  </div>
                  <div className="document-upload">
                    <label htmlFor="inscription-upload" className="upload-button">
                      <i className="fas fa-upload"></i> Modifier
                    </label>
                    <input 
                      type="file" 
                      id="inscription-upload" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                      onChange={(e) => handleDocumentUpload(e, 'inscription')}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div ref={notificationRef} className={`notification ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
            {notification.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
            {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
            {notification.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
          </div>
          <div className="notification-content">
            <p>{notification.message}</p>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification({...notification, show: false})}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default MonCompte;