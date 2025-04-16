import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/ProfessionnelApplique.css';

const ProfessionnelApplique = () => {
  const navigate = useNavigate();
  const { offers, candidates, loading, error } = useOffers();
  
  // États pour les filtres et les candidatures
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [candidatures, setCandidatures] = useState([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  
  // Charger les données à partir du contexte
  useEffect(() => {
    if (offers && candidates) {
      // Transformer les candidats du contexte en format adapté à ce composant
      const candidaturesList = candidates.map(candidate => {
        // Trouver l'offre associée
        const relatedOffer = offers.find(offer => offer.id === candidate.offerId);
        
        // Déterminer le statut
        let statut, statutLabel;
        switch(candidate.status) {
          case 'selected':
            statut = 'entretien';
            statutLabel = 'Entretien prévu';
            break;
          case 'accepted':
            statut = 'acceptée';
            statutLabel = 'Offre acceptée';
            break;
          case 'pending':
            statut = 'examen';
            statutLabel = 'En cours d\'examen';
            break;
          case 'rejected':
            statut = 'refusée';
            statutLabel = 'Non retenu';
            break;
          default:
            statut = 'reçue';
            statutLabel = 'Candidature reçue';
        }
        
        return {
          id: candidate.id,
          titre: relatedOffer ? relatedOffer.title : 'Offre non disponible',
          clinique: relatedOffer ? relatedOffer.cliniqueName : 'Clinique inconnue',
          lieu: relatedOffer ? relatedOffer.location : '',
          logo: relatedOffer ? relatedOffer.cliniqueName.charAt(0) : 'X',
          dateCandidature: candidate.applicationDate,
          statut,
          statutLabel,
          dateDébut: relatedOffer ? relatedOffer.startDate : '',
          dateFin: relatedOffer ? relatedOffer.endDate : '',
          dateEntretien: candidate.status === 'selected' ? 
            new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
          heureEntretien: '14:00',
          typeEntretien: 'video',
          salaire: relatedOffer ? relatedOffer.compensation : '',
          notes: candidate.notes || 'Aucune note disponible'
        };
      });
      
      setCandidatures(candidaturesList);
      setFilteredCandidatures(candidaturesList);
    }
  }, [offers, candidates]);
  
  // Filtrer les candidatures
  useEffect(() => {
    let result = [...candidatures];
    
    // Filtrer par recherche
    if (searchTerm) {
      result = result.filter(candidature => 
        candidature.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.clinique.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par statut
    if (filterStatus !== 'all') {
      result = result.filter(candidature => candidature.statut === filterStatus);
    }
    
    // Tri
    if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.dateCandidature) - new Date(a.dateCandidature));
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.dateCandidature) - new Date(b.dateCandidature));
    } else if (sortBy === 'statut') {
      // Ordre personnalisé des statuts
      const ordreStatuts = {
        'entretien': 1,
        'acceptée': 2,
        'examen': 3,
        'reçue': 4,
        'refusée': 5
      };
      
      result.sort((a, b) => ordreStatuts[a.statut] - ordreStatuts[b.statut]);
    }
    
    setFilteredCandidatures(result);
  }, [candidatures, searchTerm, filterStatus, sortBy]);
  
  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-CA', options);
  };
  
  // Navigation vers le détail d'une offre
  const navigateToDetail = (id) => {
    navigate(`/applique/${id}`);
  };
  
  // Retirer une candidature
  const retirerCandidature = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir retirer cette candidature?')) {
      setCandidatures(candidatures.filter(candidature => candidature.id !== id));
    }
  };
  
  // Préparation à l'entretien
  const preparerEntretien = (id, e) => {
    e.stopPropagation();
    navigate(`/preparer-entretien/${id}`);
  };
  
  // Couleur de statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'entretien':
        return 'status-interview';
      case 'acceptée':
        return 'status-accepted';
      case 'examen':
        return 'status-review';
      case 'reçue':
        return 'status-received';
      case 'refusée':
        return 'status-rejected';
      default:
        return '';
    }
  };
  
  return (
    <div className="professionnel-applique-container">
      <div className="page-header">
        <h1>Mes candidatures</h1>
        <p>Suivez l'état de vos candidatures et préparez vos entretiens</p>
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
        
        <div className="filters-row">
          <div className="filter-group">
            <label>Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="entretien">Entretien prévu</option>
              <option value="acceptée">Offre acceptée</option>
              <option value="examen">En cours d'examen</option>
              <option value="reçue">Candidature reçue</option>
              <option value="refusée">Non retenu</option>
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
              <option value="statut">Statut (priorité)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="candidatures-results">
        <p className="results-count">
          {loading ? 'Chargement des candidatures...' : 
           `${filteredCandidatures.length} candidature(s) trouvée(s)`}
        </p>
        
        {error && (
          <div className="error-message">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>Une erreur est survenue lors du chargement des candidatures</p>
          </div>
        )}
        
        {!loading && filteredCandidatures.length === 0 ? (
          <div className="no-results">
            <i className="fa-solid fa-folder-open"></i>
            <h3>Aucune candidature pour le moment</h3>
            <p>Commencez à postuler à des offres pour voir vos candidatures ici</p>
            <button 
              className="explore-button"
              onClick={() => navigate('/offres')}
            >
              <i className="fa-solid fa-search"></i> Explorer les offres
            </button>
          </div>
        ) : (
          <div className="candidatures-list">
            {filteredCandidatures.map(candidature => (
              <div 
                key={candidature.id} 
                className="candidature-card"
                onClick={() => navigateToDetail(candidature.id)}
              >
                <div className="candidature-left">
                  <div className={`candidature-logo ${candidature.statut}`}>
                    {candidature.logo}
                  </div>
                  <div className="candidature-info">
                    <h3>{candidature.titre}</h3>
                    <p className="candidature-clinique">
                      <i className="fa-solid fa-hospital"></i> {candidature.clinique}
                    </p>
                    <p className="candidature-lieu">
                      <i className="fa-solid fa-location-dot"></i> {candidature.lieu}
                    </p>
                    <p className="candidature-date">
                      <i className="fa-solid fa-calendar"></i> Du {formatDate(candidature.dateDébut)} au {formatDate(candidature.dateFin)}
                    </p>
                    {candidature.salaire && (
                      <p className="candidature-salaire">
                        <i className="fa-solid fa-money-bill-wave"></i> {candidature.salaire}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="candidature-right">
                  <div className="candidature-meta">
                    <p className="candidature-applied">
                      <i className="fa-solid fa-paper-plane"></i> Candidature envoyée le {formatDate(candidature.dateCandidature)}
                    </p>
                    <div className={`candidature-status ${getStatusColor(candidature.statut)}`}>
                      {candidature.statut === 'entretien' && <i className="fa-solid fa-calendar-check"></i>}
                      {candidature.statut === 'acceptée' && <i className="fa-solid fa-check-circle"></i>}
                      {candidature.statut === 'examen' && <i className="fa-solid fa-hourglass-half"></i>}
                      {candidature.statut === 'reçue' && <i className="fa-solid fa-envelope-open"></i>}
                      {candidature.statut === 'refusée' && <i className="fa-solid fa-times-circle"></i>}
                      <span>{candidature.statutLabel}</span>
                    </div>
                    
                    {candidature.statut === 'entretien' && candidature.dateEntretien && (
                      <div className="entretien-details">
                        <i className="fa-solid fa-video"></i>
                        <span>Entretien le {formatDate(candidature.dateEntretien)} à {candidature.heureEntretien}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="candidature-actions">
                    {candidature.statut === 'entretien' && (
                      <button 
                        className="prepare-button"
                        onClick={(e) => preparerEntretien(candidature.id, e)}
                      >
                        <i className="fa-solid fa-clipboard-check"></i> Préparer
                      </button>
                    )}
                    {candidature.statut !== 'acceptée' && candidature.statut !== 'refusée' && (
                      <button 
                        className="withdraw-button"
                        onClick={(e) => retirerCandidature(candidature.id, e)}
                      >
                        <i className="fa-solid fa-ban"></i> Retirer
                      </button>
                    )}
                  </div>
                </div>
                
                {candidature.notes && (
                  <div className="candidature-notes">
                    <i className="fa-solid fa-sticky-note"></i> Notes: {candidature.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionnelApplique;