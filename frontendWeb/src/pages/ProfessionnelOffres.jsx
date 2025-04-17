import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/ProfessionnelOffres.css';

const ProfessionnelOffres = () => {
  const navigate = useNavigate();
  const { offers, fetchNearbyOffers, loading, error } = useOffers();
  
  // Profil utilisateur (dans une application réelle, viendrait d'un contexte d'authentification)
  const [userProfile, setUserProfile] = useState({
    mobilite: {
      rayon: 50,
      adressePrincipale: "15 Rue du Docteur Roux, 75015 Paris",
      coordinates: {
        lat: 48.8417,
        lng: 2.3093
      },
      vehicule: true
    },
    disponibilite: {
      jours: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]
    }
  });
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('toutes');
  const [filterLieu, setFilterLieu] = useState('tous');
  const [filterDurée, setFilterDurée] = useState('toutes');
  const [sortBy, setSortBy] = useState('date_desc');
  
  // États pour les filtres avancés
  const [filterJours, setFilterJours] = useState([]);
  const [useProfileMobility, setUseProfileMobility] = useState(true);
  const [filterDistance, setFilterDistance] = useState(userProfile.mobilite.rayon);
  const [userLocation, setUserLocation] = useState(userProfile.mobilite.adressePrincipale);
  const [userCoordinates, setUserCoordinates] = useState(userProfile.mobilite.coordinates);
  
  // État pour les offres
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [savedOffers, setSavedOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Référence pour l'autocomplétion Google Maps
  const addressInputRef = React.useRef(null);
  
  // Options pour les jours de la semaine
  const joursOptions = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' },
  ];
  
  // Charger le script Google Maps
  useEffect(() => {
    if (!window.google) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=VOTRE_CLE_API_GOOGLE_MAPS&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      window.document.body.appendChild(googleMapsScript);
      
      googleMapsScript.onload = initializeAutocomplete;
      
      return () => {
        // Supprimer le script lorsque le composant est démonté
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src.includes('maps.googleapis.com')) {
            scripts[i].parentNode.removeChild(scripts[i]);
            break;
          }
        }
      };
    } else {
      initializeAutocomplete();
    }
  }, []);
  
  // Initialiser l'autocomplétion
  const initializeAutocomplete = () => {
    if (addressInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['fr'] } // Limiter à la France
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        
        // Mise à jour de l'adresse et des coordonnées
        setUserLocation(place.formatted_address);
        setUserCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      });
    }
  };
  
  // Mettre à jour le rayon de recherche et la position quand on change entre profil et personnalisé
  useEffect(() => {
    if (useProfileMobility) {
      setFilterDistance(userProfile.mobilite.rayon);
      setUserLocation(userProfile.mobilite.adressePrincipale);
      setUserCoordinates(userProfile.mobilite.coordinates);
    }
  }, [useProfileMobility, userProfile]);
  
  // Charger les offres à proximité
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Pour une implémentation réelle, utilisez ces paramètres
        // Cependant, comme nous sommes en frontend uniquement,
        // nous allons simuler le filtrage côté client
        const params = {
          latitude: userCoordinates?.lat || 0,
          longitude: userCoordinates?.lng || 0,
          radius: filterDistance
        };
        
        // Dans une implémentation réelle, décommenter cette ligne:
        // await fetchNearbyOffers(params);
        
        // Pour l'instant, filtrer côté client
        filterOffers();
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
      }
    };
    
    fetchOffers();
  }, [userCoordinates, filterDistance, useProfileMobility]);
  
  // Filtrer les offres
  const filterOffers = () => {
    if (!offers) return;
    
    let result = [...offers];
    
    // Filtrer par texte de recherche
    if (searchTerm) {
      result = result.filter(offer => 
        offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.cliniqueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par profession
    if (filterProfession !== 'toutes') {
      result = result.filter(offer => offer.profession === filterProfession);
    }
    
    // Filtrer par lieu
    if (filterLieu !== 'tous') {
      result = result.filter(offer => offer.location?.includes(filterLieu));
    }
    
    // Filtrer par durée
    if (filterDurée === 'journee') {
      // Offres d'une journée
      result = result.filter(offer => offer.isSingleDay);
    } else if (filterDurée === 'court') {
      // Court terme (< 1 mois)
      result = result.filter(offer => {
        if (offer.isSingleDay) return true;
        
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diffDays < 30;
      });
    } else if (filterDurée === 'moyen') {
      // Moyen terme (1-3 mois)
      result = result.filter(offer => {
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diffDays >= 30 && diffDays <= 90;
      });
    } else if (filterDurée === 'long') {
      // Long terme (> 3 mois)
      result = result.filter(offer => {
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diffDays > 90;
      });
    }
    
    // Filtrer par jours disponibles
    if (filterJours.length > 0) {
      result = result.filter(offer => {
        // Pour une offre d'un seul jour
        if (offer.isSingleDay) {
          const date = new Date(offer.startDate);
          const dayOfWeek = date.getDay();
          // Convertir 0-6 en noms de jours
          const dayName = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][dayOfWeek];
          return filterJours.includes(dayName);
        }
        
        // Pour les offres sur plusieurs jours, on peut implémenter une logique plus complexe
        // Pour simplifier, on considère que l'offre est OK si elle couvre au moins un des jours filtrés
        return true;
      });
    }
    
    // Filtrer par onglet (sauvegardées)
    if (activeTab === 'saved') {
      result = result.filter(offer => savedOffers.includes(offer.id));
    }
    
    // Tri
    if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.datePosted || b.createdAt) - new Date(a.datePosted || a.createdAt));
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.datePosted || a.createdAt) - new Date(b.datePosted || b.createdAt));
    } else if (sortBy === 'salary_desc') {
      // Logique simplifiée: extraction du premier nombre trouvé dans compensation
      result.sort((a, b) => {
        const salaryA = parseInt(a.compensation?.match(/\d+/)?.[0] || 0);
        const salaryB = parseInt(b.compensation?.match(/\d+/)?.[0] || 0);
        return salaryB - salaryA;
      });
    } else if (sortBy === 'salary_asc') {
      result.sort((a, b) => {
        const salaryA = parseInt(a.compensation?.match(/\d+/)?.[0] || 0);
        const salaryB = parseInt(b.compensation?.match(/\d+/)?.[0] || 0);
        return salaryA - salaryB;
      });
    }
    
    setFilteredOffers(result);
  };
  
  // Surveiller les changements des filtres
  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, filterProfession, filterLieu, filterDurée, sortBy, activeTab, filterJours, savedOffers]);
  
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return dateString;
    }
  };
  
  // Fonction pour calculer la durée
  const calculerDurée = (début, fin) => {
    if (!début || !fin) return '';
    
    if (début === fin) {
      return "1 jour";
    }
    
    try {
      const start = new Date(début);
      const end = new Date(fin);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} semaine${weeks > 1 ? 's' : ''}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} mois`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} an${years > 1 ? 's' : ''}`;
      }
    } catch (error) {
      return "Durée inconnue";
    }
  };
  
  // Fonction pour enregistrer/retirer des favoris
  const toggleSaveOffer = (id) => {
    if (savedOffers.includes(id)) {
      setSavedOffers(savedOffers.filter(savedId => savedId !== id));
    } else {
      setSavedOffers([...savedOffers, id]);
    }
    
    // Dans une application réelle, envoyer au backend
    // saveOfferToFavorites(id);
  };
  
  // Navigation vers le détail d'une offre
  const navigateToDetail = (id) => {
    navigate(`/offres/${id}`);
  };
  
  // Fonction pour postuler
  const handleApply = (e, id) => {
    e.stopPropagation();
    navigate(`/postuler/${id}`);
  };
  
  // Fonction pour gérer les jours de disponibilité
  const handleDayToggle = (jour) => {
    if (filterJours.includes(jour)) {
      setFilterJours(filterJours.filter(j => j !== jour));
    } else {
      setFilterJours([...filterJours, jour]);
    }
  };
  
  return (
    <div className="professionnel-offres-container">
      <div className="offres-header">
        <h1>Offres de remplacement</h1>
        <p>Trouvez le remplacement idéal parmi nos offres disponibles</p>
      </div>

      <div className="offres-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Toutes les offres
        </button>
        <button 
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <i className="fa-solid fa-bookmark"></i> Offres sauvegardées ({savedOffers.length})
        </button>
      </div>

      <div className="filter-container">
        <div className="search-bar">
          <i className="fa-solid fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher par titre, clinique ou lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label>Profession</label>
            <select
              value={filterProfession}
              onChange={(e) => setFilterProfession(e.target.value)}
            >
              <option value="toutes">Toutes</option>
              <option value="dentiste">Dentiste</option>
              <option value="hygieniste">Hygiéniste</option>
              <option value="assistant">Assistant(e)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Lieu</label>
            <select
              value={filterLieu}
              onChange={(e) => setFilterLieu(e.target.value)}
            >
              <option value="tous">Tous</option>
              <option value="Paris">Paris</option>
              <option value="Lyon">Lyon</option>
              <option value="Marseille">Marseille</option>
              <option value="Bordeaux">Bordeaux</option>
              <option value="Lille">Lille</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Durée</label>
            <select
              value={filterDurée}
              onChange={(e) => setFilterDurée(e.target.value)}
            >
              <option value="toutes">Toutes</option>
              <option value="journee">Une journée</option>
              <option value="court">Court terme (&lt; 1 mois)</option>
              <option value="moyen">Moyen terme (1-3 mois)</option>
              <option value="long">Long terme (&gt; 3 mois)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date_desc">Date (récent → ancien)</option>
              <option value="date_asc">Date (ancien → récent)</option>
              <option value="salary_desc">Salaire (haut → bas)</option>
              <option value="salary_asc">Salaire (bas → haut)</option>
            </select>
          </div>
        </div>
        
        {/* Filtres avancés */}
        <div className="advanced-filters">
          <h3 className="filter-section-title">Filtres avancés</h3>
          
          {/* Filtres par jour de la semaine */}
          <div className="filter-section">
            <label className="filter-label">Disponibilités</label>
            <div className="days-filter">
              {joursOptions.map(jour => (
                <label key={jour.value} className="day-checkbox">
                  <input 
                    type="checkbox"
                    checked={filterJours.includes(jour.value)}
                    onChange={() => handleDayToggle(jour.value)}
                  />
                  <span className="day-label">{jour.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Filtres par mobilité */}
          <div className="filter-section location-filter">
            <label className="filter-label">Mobilité</label>
            
            <div className="mobility-option">
              <label className="toggle-container">
                <input
                  type="checkbox"
                  checked={useProfileMobility}
                  onChange={() => setUseProfileMobility(!useProfileMobility)}
                />
                <span className="toggle-label">Utiliser mon rayon de mobilité ({userProfile.mobilite.rayon} km)</span>
              </label>
              <p className="profile-mobility-info">
                <i className="fa-solid fa-info-circle"></i> Selon votre profil, vous êtes mobile dans un rayon de {userProfile.mobilite.rayon} km autour de <strong>{userProfile.mobilite.adressePrincipale}</strong>
                <button 
                  className="edit-profile-link"
                  onClick={() => navigate('/mon-compte')}
                >
                  <i className="fa-solid fa-pen"></i> Modifier
                </button>
              </p>
            </div>
            
            {!useProfileMobility && (
              <div className="location-inputs">
                <input
                  type="text"
                  placeholder="Entrez votre adresse..."
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="location-input"
                  ref={addressInputRef}
                />
                
                <div className="radius-slider">
                  <label>Rayon: {filterDistance} km</label>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={filterDistance}
                    onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="offres-results">
        <p className="results-count">
          {loading ? 'Chargement des offres...' : `${filteredOffers.length} offre(s) trouvée(s)`}
        </p>
        
        {error && (
          <div className="error-message">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>Une erreur est survenue lors du chargement des offres. Veuillez réessayer plus tard.</p>
          </div>
        )}
        
        {!loading && filteredOffers.length === 0 ? (
          <div className="no-results">
            <i className="fa-solid fa-face-sad-tear"></i>
            <h3>Aucune offre ne correspond à vos critères</h3>
            <p>Essayez de modifier vos filtres ou d'élargir votre recherche</p>
          </div>
        ) : (
          <div className="offres-grid">
            {filteredOffers.map(offer => (
              <div key={offer.id} className="offre-card">
                <div className="offre-header">
                  <div className="offre-tags">
                    {offer.status === 'active' && (
                      <span className="offre-tag nouveau">Actif</span>
                    )}
                    {offer.status === 'pending' && (
                      <span className="offre-tag attente">En attente</span>
                    )}
                    {offer.isSingleDay && (
                      <span className="offre-tag journee">1 jour</span>
                    )}
                  </div>
                  <button 
                    className={`save-button ${savedOffers.includes(offer.id) ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveOffer(offer.id);
                    }}
                  >
                    <i className={`fa-${savedOffers.includes(offer.id) ? 'solid' : 'regular'} fa-bookmark`}></i>
                  </button>
                </div>
                
                <div className="offre-content" onClick={() => navigateToDetail(offer.id)}>
                  <h2 className="offre-title">{offer.title}</h2>
                  <p className="offre-clinique">
                    <i className="fa-solid fa-hospital"></i> {offer.cliniqueName}
                  </p>
                  <p className="offre-lieu">
                    <i className="fa-solid fa-location-dot"></i> {offer.location}
                  </p>
                  <p className="offre-salaire">
                    <i className="fa-solid fa-money-bill-wave"></i> {offer.compensation}
                  </p>
                  <p className="offre-date">
                    <i className="fa-solid fa-calendar"></i> 
                    {offer.isSingleDay 
                      ? `Le ${formatDate(offer.startDate)}` 
                      : `Du ${formatDate(offer.startDate)} au ${formatDate(offer.endDate)}`}
                  </p>
                  <p className="offre-durée">
                    <i className="fa-solid fa-clock"></i> Durée: {calculerDurée(offer.startDate, offer.endDate)}
                  </p>
                  <p className="offre-description">
                    {offer.description?.length > 150 
                      ? offer.description.substring(0, 150) + '...' 
                      : offer.description}
                  </p>
                </div>
                
                <div className="offre-footer">
                  <span className="offre-date-publication">
                    Publié le {formatDate(offer.datePosted || offer.createdAt)}
                  </span>
                  <div className="offre-buttons">
                    <button 
                      className="details-button"
                      onClick={() => navigateToDetail(offer.id)}
                    >
                      Voir détails
                    </button>
                    <button 
                      className="apply-button"
                      onClick={(e) => handleApply(e, offer.id)}
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionnelOffres;