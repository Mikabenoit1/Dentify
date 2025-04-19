import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNearbyOffersAPI } from '../lib/offerApi';
import { fetchAllCliniques } from '../lib/clinicApi';
import { postulerOffre } from '../lib/candidatureApi';
import '../styles/ProfessionnelOffres.css';

const ProfessionnelOffres = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [cliniquesMap, setCliniquesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLieu, setFilterLieu] = useState('tous');
  const [filterDurée, setFilterDurée] = useState('toutes');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('toutes');
  const [filterDistance, setFilterDistance] = useState(50);
  const [savedOffers, setSavedOffers] = useState([]);
  const [filterJours, setFilterJours] = useState([]);
  const [sortBy, setSortBy] = useState('date_desc');
  const [activeTab, setActiveTab] = useState('all');

  const [userLocation, setUserLocation] = useState("Valleyfield, QC");
  const [userCoordinates, setUserCoordinates] = useState({ lat: 45.2538, lng: -74.1334 });
  const [useProfileMobility, setUseProfileMobility] = useState(true);

  const addressInputRef = useRef(null);

  const joursOptions = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' }
  ];

  // Fonction pour basculer un jour dans les filtres
  const handleDayToggle = (jour) => {
    if (filterJours.includes(jour)) {
      setFilterJours(filterJours.filter(j => j !== jour));
    } else {
      setFilterJours([...filterJours, jour]);
    }
  };

  // Fonction pour basculer la sauvegarde d'une offre
  const toggleSaveOffer = (offerId) => {
    if (savedOffers.includes(offerId)) {
      setSavedOffers(savedOffers.filter(id => id !== offerId));
    } else {
      setSavedOffers([...savedOffers, offerId]);
    }
  };

  // Fonction de navigation vers les détails d'une offre
  const navigateToDetail = (offerId) => {
    navigate(`/offres/${offerId}`);
  };

  // Récupérer le nom de la clinique à partir de l'ID
  const getClinicName = (cliniqueId) => {
    return cliniquesMap[cliniqueId] || "Clinique inconnue";
  };

  // Récupérer les données des cliniques
  useEffect(() => {
    const fetchCliniques = async () => {
      try {
        const cliniques = await fetchAllCliniques();
        const map = {};
        
        cliniques.forEach(clinique => {
          map[clinique.id_clinique] = clinique.nom;
        });
        
        setCliniquesMap(map);
      } catch (error) {
        console.error("Erreur lors du chargement des cliniques:", error);
      }
    };

    fetchCliniques();
  }, []);

  // Récupérer les offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await fetchNearbyOffersAPI(userCoordinates, filterDistance);
        setOffers(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
        setError("Erreur de chargement.");
        setLoading(false);
      }
    };

    fetchOffers();
  }, [userCoordinates, filterDistance]);

  // Filtrer les offres
  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, filterProfession, filterJours, sortBy, activeTab, savedOffers, cliniquesMap]);

  const filterOffers = () => {
    let result = [...offers];

    if (searchTerm) {
      result = result.filter(offer => {
        const cliniqueName = getClinicName(offer.id_clinique);
        return (
          offer.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.descript?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.adresse_complete?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliniqueName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filterProfession !== 'toutes') {
      result = result.filter(offer => offer.type_professionnel === filterProfession);
    }

    if (filterJours.length > 0) {
      result = result.filter(offer => {
        const date = new Date(offer.date_debut);
        const dayOfWeek = date.getDay();
        const dayName = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][dayOfWeek];
        return filterJours.includes(dayName);
      });
    }

    if (activeTab === 'saved') {
      result = result.filter(offer => savedOffers.includes(offer.id_offre));
    }

    if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication));
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.date_publication) - new Date(b.date_publication));
    } else if (sortBy === 'salary_desc') {
      result.sort((a, b) => b.remuneration - a.remuneration);
    } else if (sortBy === 'salary_asc') {
      result.sort((a, b) => a.remuneration - b.remuneration);
    }

    setFilteredOffers(result);
  };

  const handleApply = async (e, id_offre) => {
    e.stopPropagation();
  
    try {
      await postulerOffre(id_offre);
      alert("✅ Candidature envoyée !");
    } catch (err) {
      console.error("❌ Erreur lors de la candidature :", err);
      alert("❌ Une erreur est survenue lors de la candidature.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
  
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return dateString;
    }
  };

  const calculerDurée = (début, fin) => {
    if (!début || !fin) return '';
  
    if (début === fin) return '1 jour';
  
    try {
      const start = new Date(début);
      const end = new Date(fin);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      if (diffDays < 7) return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} semaine${diffDays >= 14 ? 's' : ''}`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} mois`;
      return `${Math.floor(diffDays / 365)} an${diffDays >= 730 ? 's' : ''}`;
    } catch (error) {
      return 'Durée inconnue';
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
                <span className="toggle-label">Utiliser mon rayon de mobilité ({filterDistance} km)</span>
              </label>
              <p className="profile-mobility-info">
                <i className="fa-solid fa-info-circle"></i> Selon votre profil, vous êtes mobile dans un rayon de {filterDistance} km autour de <strong>{userLocation}</strong>
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
          {filteredOffers.map((offer) => (
            <div key={offer.id_offre} className="offre-card">
              <div className="offre-header">
                <div className="offre-tags">
                  {offer.statut === 'active' && (
                    <span className="offre-tag nouveau">Actif</span>
                  )}
                  {offer.statut === 'pending' && (
                    <span className="offre-tag attente">En attente</span>
                  )}
                  {offer.date_debut === offer.date_fin && (
                    <span className="offre-tag journee">1 jour</span>
                  )}
                </div>
                <button 
                  className={`save-button ${savedOffers.includes(offer.id_offre) ? 'saved' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveOffer(offer.id_offre);
                  }}
                >
                  <i className={`fa-${savedOffers.includes(offer.id_offre) ? 'solid' : 'regular'} fa-bookmark`}></i>
                </button>
              </div>
                
              <div className="offre-content" onClick={() => navigateToDetail(offer.id_offre)}>
                <h2 className="offre-title">{offer.titre}</h2>
                <p className="offre-clinique">
                  <i className="fa-solid fa-hospital"></i> {getClinicName(offer.id_clinique)}
                </p>
                <p className="offre-lieu">
                  <i className="fa-solid fa-location-dot"></i> {offer.adresse_complete}
                </p>
                <p className="offre-salaire">
                  <i className="fa-solid fa-money-bill-wave"></i> {offer.remuneration} €
                </p>
                <p className="offre-date">
                  <i className="fa-solid fa-calendar"></i>
                  {offer.date_debut === offer.date_fin
                    ? `Le ${formatDate(offer.date_debut)}`
                    : `Du ${formatDate(offer.date_debut)} au ${formatDate(offer.date_fin)}`}
                </p>
                <p className="offre-durée">
                  <i className="fa-solid fa-clock"></i> Durée: {calculerDurée(offer.date_debut, offer.date_fin)}
                </p>
                <p className="offre-description">
                  {offer.descript?.length > 150
                    ? offer.descript.substring(0, 150) + '...'
                    : offer.descript}
                </p>
              </div>
                
              <div className="offre-footer">
                <span className="offre-date-publication">
                  Publié le {formatDate(offer.date_publication)}
                </span>
                <div className="offre-buttons">
                  <button 
                    className="details-button"
                    onClick={() => navigateToDetail(offer.id_offre)}
                  >
                    Voir détails
                  </button>
                  <button 
                    className="apply-button"
                    onClick={(e) => handleApply(e, offer.id_offre)}
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