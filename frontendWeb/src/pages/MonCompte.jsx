import React, { useState, useEffect, useRef } from 'react';
import '../styles/MonCompte.css';
import { apiFetch, FILE_BASE_URL, API_BASE_URL  } from '../lib/apiFetch'; 
// Import de apiFetch


import {
  fetchUserProfile,
  updateUserProfile,
  uploadUserPhoto,
  uploadUserDocument,
  downloadUserDocument,
  transformApiDataToComponentFormat,
  transformComponentDataToApiFormat
} from '../lib/userApi';

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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour stocker les modifications en cours
  const [editedProfile, setEditedProfile] = useState(null);
  
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
  
  // Charger les données du profil depuis le backend
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const apiData = await fetchUserProfile();
        const formattedData = transformApiDataToComponentFormat(apiData);
        setProfile(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les données du profil. Veuillez réessayer plus tard.");
        setLoading(false);
        console.error("Erreur lors du chargement du profil:", err);
      }
    };
    
    loadUserProfile();
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
    const input = document.getElementById("mobilite.adressePrincipale");
    if (input && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: ['ca'] } // Limiter à la France
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        
        // Adresse complète
        const formattedAddress = place.formatted_address;
        
        // Extraire les composants de l'adresse (rue, ville, code postal, etc.)
        let streetNumber = '';
        let route = '';
        let locality = ''; // ville
        let postalCode = '';
        let administrativeArea = ''; // province/région
        
        // Parcourir les composants d'adresse pour extraire les informations nécessaires
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
        
        // Construire l'adresse de rue (numéro + rue)
        const streetAddress = streetNumber 
          ? `${streetNumber} ${route}` 
          : route;
        
        // Mise à jour de l'adresse et des coordonnées
        setEditedProfile(prev => ({
          ...prev,
          // Conserver l'adresse complète pour l'affichage
          mobilite: {
            ...prev.mobilite,
            adressePrincipale: formattedAddress,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          },
          // Ajouter les champs individuels pour le backend
          adresse: streetAddress,
          ville: locality,
          province: administrativeArea,
          code_postal: postalCode
        }));
      });
    }
  };
  
// Fonction pour activer le mode édition
const handleEdit = () => {
  try {
    console.log("Début handleEdit");
    
    // Vérifier que profile contient des données
    console.log("Profile data:", profile);
    
    setEditMode(true);
    console.log("Mode édition activé");
    
    setEditedProfile({...profile});
    console.log("Profile copié pour édition");
    
    // Désactiver temporairement l'autocomplétion pour voir si c'est la cause du problème
    /*
    setTimeout(() => {
      initializeAutocomplete();
    }, 100);
    */
    
    console.log("Fin handleEdit sans erreur");
  } catch (error) {
    console.error("Erreur dans handleEdit:", error);
  }
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
    if (!editedProfile.nom?.trim()) {
      showNotification("Veuillez entrer votre nom", "error");
      return false;
    }
    
    if (!editedProfile.prenom?.trim()) {
      showNotification("Veuillez entrer votre prénom", "error");
      return false;
    }
    
    if (!editedProfile.email?.trim()) {
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
    if (editedProfile.disponibilite?.debut && editedProfile.disponibilite?.fin &&
        new Date(editedProfile.disponibilite.debut) > new Date(editedProfile.disponibilite.fin)) {
      showNotification("La date de début doit être antérieure à la date de fin", "error");
      return false;
    }
    
    // Validation du tarif journalier
    if (editedProfile.tarifJournalier && parseInt(editedProfile.tarifJournalier) <= 0) {
      showNotification("Veuillez entrer un tarif journalier valide", "error");
      return false;
    }
    
    return true;
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    // Valider les données avant de sauvegarder
    if (!validateProfile()) {
      return;
    }
    
    try {
      // Envoyer les données au serveur via l'API
      const apiData = transformComponentDataToApiFormat(editedProfile);
      if (editedProfile.coordinates) {
        apiData.latitude = editedProfile.coordinates.lat;
        apiData.longitude = editedProfile.coordinates.lng;
      }
      setLoading(true);
      await updateUserProfile(apiData);
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
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showNotification("Erreur lors de la mise à jour du profil. Veuillez réessayer.", "error");
      console.error("Erreur lors de la mise à jour du profil:", err);
    }
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
    const currentDays = [...(editedProfile.disponibilite?.jours || [])];
    
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
            [child]: [...(editedProfile[parent]?.[child] || []), value.trim()]
          }
        });
      } else {
        setEditedProfile({
          ...editedProfile,
          [field]: [...(editedProfile[field] || []), value.trim()]
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
      if (editedProfile[parent]?.[child]) {
        const newArray = [...editedProfile[parent][child]];
        newArray.splice(index, 1);
        setEditedProfile({
          ...editedProfile,
          [parent]: {
            ...editedProfile[parent],
            [child]: newArray
          }
        });
      }
    } else if (editedProfile[field]) {
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
        educations: [...(editedProfile.educations || []), {...newEducation}]
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
    if (editedProfile.educations) {
      const newEducations = [...editedProfile.educations];
      newEducations.splice(index, 1);
      setEditedProfile({
        ...editedProfile,
        educations: newEducations
      });
    }
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
        experiences: [...(editedProfile.experiences || []), {...newExperience}]
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
    if (editedProfile.experiences) {
      const newExperiences = [...editedProfile.experiences];
      newExperiences.splice(index, 1);
      setEditedProfile({
        ...editedProfile,
        experiences: newExperiences
      });
    }
  };
  
  // Gestion du téléchargement de la photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Vérification de la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showNotification("Le fichier est trop volumineux. Taille maximale: 5MB", "error");
          return;
        }
        
        // Créer un objet FormData pour envoyer le fichier
        const formData = new FormData();
        formData.append('photo', file);
        
        setLoading(true);
        const response = await uploadUserPhoto(formData); // ← retourne { photo_profil: "uploads/photos/..." }

        const fullImageUrl = `${FILE_BASE_URL}/uploads/photos/${response.photo_profil}`;

        
        setEditedProfile({
          ...editedProfile,
          photo: fullImageUrl
        });
        
        showNotification("Photo de profil mise à jour avec succès !", "success");
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showNotification("Erreur lors de l'upload de la photo. Veuillez réessayer.", "error");
        console.error("Erreur lors de l'upload de la photo:", err);
      }
    }
  };
  
  // Dans la méthode handleDocumentUpload, ajoutez un log pour vérifier l'URL
  const handleDocumentUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Fichier sélectionné:", file);
      console.log("Type de document:", documentType);
  
      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Le fichier est trop volumineux. Taille maximale: 5MB", "error");
        return;
      }
  
      // Vérification du type de fichier selon le documentType
      const validTypesCV = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
  
      const validTypesOthers = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
  
      const allowedTypes = documentType === 'cv' ? validTypesCV : validTypesOthers;
  
      if (!allowedTypes.includes(file.type)) {
        console.error("Type de fichier non valide:", file.type);
        showNotification(
          documentType === 'cv'
            ? "Format de CV non valide. Utilisez PDF ou DOC/DOCX"
            : "Format de fichier non valide. Utilisez PDF, DOC/DOCX, JPG ou PNG",
          "error"
        );
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('type', documentType);
  
        console.log("📤 Envoi du document à:", `${API_BASE_URL}/documents/upload`);
  
        setLoading(true);
  
        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
  
        console.log("📥 Statut de la réponse:", response.status);
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Erreur du serveur:", errorData);
          throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log("✅ Résultat de l'upload:", result);
  
        setEditedProfile(prev => ({
          ...prev,
          documents: {
            ...(prev.documents || {}),
            [documentType]: result.document.filename
          }
        }));
  
        showNotification(`Le document "${file.name}" a été téléchargé avec succès`, "success");
      } catch (err) {
        console.error("🚨 Erreur détaillée lors de l'upload du document:", err);
        showNotification("Erreur lors de l'upload du document. Veuillez réessayer.", "error");
      } finally {
        setLoading(false);
      }
    }
  };  
  
  // Fonction pour télécharger un document
  const handleDocumentDownload = async (documentName, documentType) => {
    try {
      // Obtenir le blob du document
      const blob = await downloadUserDocument(documentType);
      
      // Créer un lien pour télécharger le document
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification(`Le document "${documentName}" a été téléchargé avec succès`, "success");
    } catch (err) {
      console.error("Erreur de téléchargement:", err);
      showNotification("Erreur lors du téléchargement du document. Veuillez réessayer.", "error");
    }
  };
  
  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString === "Present") return "Présent";
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      return `${month.toString().padStart(2, '0')}/${year}`;
    } catch (err) {
      return dateString;
    }
  };
  
  // Afficher un message de chargement
  if (loading && !profile) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error && !profile) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  // Si le profil n'est pas chargé, ne rien afficher
  if (!profile) {
    return null;
  }
  console.log("photo finale :", profile?.photo);
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
                    src={profile.photo || '/assets/img/profile_placeholder.jpg'} 
                    alt={profile.nom} 
                    className="profile-photo" 
                  />
                </div>
                <div className="personal-info">
                  <h3>{profile.prenom} {profile.nom}</h3>
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
                    src={editedProfile.photo || '/assets/img/profile_placeholder.jpg'} 
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
                    <label htmlFor="nom">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={editedProfile.nom || ''}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={editedProfile.prenom || ''}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profession">Profession</label>
                    <select
                      id="profession"
                      name="profession"
                      value={editedProfile.profession || 'dentiste'}
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
                      value={editedProfile.email || ''}
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
                      value={editedProfile.telephone || ''}
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
                    value={editedProfile.description || ''}
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
                  <p><strong>Adresse principale:</strong> {profile.mobilite?.adressePrincipale || 'Non spécifiée'}</p>
                  <p><strong>Rayon de mobilité:</strong> {profile.mobilite?.rayon || 0} km</p>
                  <p>
                    <strong>Véhicule personnel:</strong> 
                    {profile.mobilite?.vehicule ? (
                      <span className="has-vehicle"><i className="fas fa-check-circle"></i> Oui</span>
                    ) : (
                      <span className="no-vehicle"><i className="fas fa-times-circle"></i> Non</span>
                    )}
                  </p>
                </div>
                
                <div className="regions-info">
                  <h4>Régions d'intervention</h4>
                  <div className="regions-container">
                    {profile.mobilite?.regions?.length > 0 ? (
                      profile.mobilite.regions.map((region, index) => (
                        <span key={index} className="region-chip">{region}</span>
                      ))
                    ) : (
                      <p>Aucune région spécifiée</p>
                    )}
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
                    value={editedProfile.mobilite?.adressePrincipale || ''}
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
                      value={editedProfile.mobilite?.rayon || 0}
                      onChange={handleInputChange}
                      className="form-control range-input"
                      min="5"
                      max="200"
                      step="5"
                    />
                    <span className="range-value">{editedProfile.mobilite?.rayon || 0} km</span>
                  </div>
                  <small className="help-text">Distance maximale que vous êtes prêt à parcourir pour un remplacement</small>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="vehicule"
                      checked={editedProfile.mobilite?.vehicule || false}
                      onChange={handleVehicule}
                    />
                    <label htmlFor="vehicule">Je dispose d'un véhicule personnel</label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Régions d'intervention</label>
                  <div className="tags-container">
                    {editedProfile.mobilite?.regions?.map((region, index) => (
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
                  {profile.disponibilite?.debut && profile.disponibilite?.fin ? (
                    <p>Du {new Date(profile.disponibilite.debut).toLocaleDateString('fr-FR')} au {new Date(profile.disponibilite.fin).toLocaleDateString('fr-FR')}</p>
                  ) : (
                    <p>Période non spécifiée</p>
                  )}
                  {profile.disponibilite?.disponibleImmediatement && (
                    <p className="immediate-availability"><i className="fas fa-check-circle"></i> Disponible immédiatement</p>
                  )}
                </div>
                
                <div className="availability-days">
                  <h4>Jours disponibles</h4>
                  <div className="days-container">
                    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((day) => (
                      <div 
                        key={day} 
                        className={`day-chip ${profile.disponibilite?.jours?.includes(day) ? 'active' : 'inactive'}`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="daily-rate">
                  <h4>Tarif journalier</h4>
                  <p className="rate-amount">{profile.tarifJournalier || 0} €</p>
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
                      value={editedProfile.disponibilite?.debut || ''}
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
                      value={editedProfile.disponibilite?.fin || ''}
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
                          checked={editedProfile.disponibilite?.jours?.includes(day) || false}
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
                      checked={editedProfile.disponibilite?.disponibleImmediatement || false}
                      onChange={handleDisponibiliteImmediate}
                    />
                    <label htmlFor="disponibiliteImmediate">Disponible immédiatement</label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tarifJournalier">Tarif journalier ($)</label>
                  <input
                    type="number"
                    id="tarifJournalier"
                    name="tarifJournalier"
                    value={editedProfile.tarifJournalier || ''}
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
                  {profile.competences?.length > 0 ? (
                    profile.competences.map((competence, index) => (
                      <span key={index} className="skill-chip">{competence}</span>
                    ))
                  ) : (
                    <p>Aucune compétence spécifiée</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Compétences professionnelles</label>
                  <div className="tags-container">
                    {editedProfile.competences?.map((competence, index) => (
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
                  {profile.langues?.length > 0 ? (
                    profile.langues.map((langue, index) => (
                      <span key={index} className="language-chip">{langue}</span>
                    ))
                  ) : (
                    <p>Aucune langue spécifiée</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Langues maîtrisées</label>
                  <div className="tags-container">
                    {editedProfile.langues?.map((langue, index) => (
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
                  <span className="document-filename">{profile.documents?.cv || 'Non fourni'}</span>
                  {profile.documents?.cv && (
                    <button 
                      className="document-action"
                      onClick={() => handleDocumentDownload(profile.documents.cv, 'cv')}
                    >
                      <i className="fas fa-download"></i> Télécharger
                    </button>
                  )}
                </div>
                
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span className="document-name">Diplôme</span>
                  <span className="document-filename">{profile.documents?.diplome || 'Non fourni'}</span>
                  {profile.documents?.diplome && (
                    <button 
                      className="document-action"
                      onClick={() => handleDocumentDownload(profile.documents.diplome, 'diplome')}
                    >
                      <i className="fas fa-download"></i> Télécharger
                    </button>
                  )}
                </div>
                
                <div className="document-item">
                  <i className="fas fa-file-pdf"></i>
                  <span className="document-name">Inscription ordre professionnel</span>
                  <span className="document-filename">{profile.documents?.inscription || 'Non fourni'}</span>
                  {profile.documents?.inscription && (
                    <button 
                      className="document-action"
                      onClick={() => handleDocumentDownload(profile.documents.inscription, 'inscription')}
                    >
                      <i className="fas fa-download"></i> Télécharger
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="document-edit-item">
                  <div className="document-info">
                    <span className="document-label">CV</span>
                    <span className="document-current">{editedProfile.documents?.cv || 'Non fourni'}</span>
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
                    <span className="document-current">{editedProfile.documents?.diplome || 'Non fourni'}</span>
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
                    <span className="document-current">{editedProfile.documents?.inscription || 'Non fourni'}</span>
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
      
      {/* Overlay de chargement pendant les opérations */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default MonCompte;