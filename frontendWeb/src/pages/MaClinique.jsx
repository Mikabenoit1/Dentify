import React, { useState, useEffect } from 'react';
import '../styles/MaClinique.css';
import { apiFetch } from '../lib/apiFetch';
import { getClinique, updateClinique } from '../lib/apiFetch';


const MaClinique = () => {
  const [clinique, setClinique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClinique, setEditedClinique] = useState(null);
  const [newService, setNewService] = useState("");
  const [newEquipement, setNewEquipement] = useState("");
  const [newSpecialite, setNewSpecialite] = useState("");
  const [newLangue, setNewLangue] = useState("");
  const [newAssurance, setNewAssurance] = useState("");
  const [newEmploye, setNewEmploye] = useState({
    nom: "",
    poste: "",
    specialite: ""
  });

   // Charger les données de la clinique
    // Dans votre useEffect pour charger les données
  useEffect(() => {
    const loadClinicProfile = async () => {
      try {
        setLoading(true);
        const data = await getClinique('ID_DE_LA_CLINIQUE'); // Remplacez par l'ID réel
        setClinique(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Impossible de charger les données");
        setLoading(false);
      }
    };
    loadClinicProfile();
  }, []);

  // Sauvegarde des modifications
  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedClinique = await updateClinique('ID_DE_LA_CLINIQUE', editedClinique);
      setClinique(updatedClinique.clinique || updatedClinique);
      setEditMode(false);
      setLoading(false);
      alert(updatedClinique.message || "Profil mis à jour avec succès");
    } catch (err) {
      setLoading(false);
      alert(err.message || "Erreur lors de la mise à jour");
    }
  };

  // Gestion du téléchargement du logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('logo', file);
        
        const response = await apiFetch('/clinique/logo', {
          method: 'POST',
          headers: {}, // Laissez Fetch gérer le Content-Type pour FormData
          body: formData
        });
        
        setEditedClinique({
          ...editedClinique,
          logo: response.logoUrl
        });
      } catch (err) {
        alert(err.message || "Erreur lors de l'upload du logo");
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
        
        const response = await apiFetch('/clinique/photos', {
          method: 'POST',
          body: formData
        });
        
        setEditedClinique({
          ...editedClinique,
          photos: [...(editedClinique.photos || []), response.photoUrl]
        });
      } catch (err) {
        alert(err.message || "Erreur lors de l'upload de la photo");
      }
    }
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

  

  // Annulation des modifications
  const handleCancel = () => {
    setEditMode(false);
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
  if (loading && !clinique) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du profil de la clinique...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error && !clinique) {
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
  
  // Si la clinique n'est pas chargée, ne rien afficher
  if (!clinique) {
    return null;
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
                      {clinique.adresse ? 
                        `${clinique.adresse}, ${clinique.codePostal || ''} ${clinique.ville || ''}` : 
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
                    <label htmlFor="adresse"><i className="fas fa-map-marker-alt"></i> Adresse</label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      value={editedClinique.adresse || ''}
                      onChange={handleInputChange}
                    />
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