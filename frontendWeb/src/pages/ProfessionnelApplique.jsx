import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserCandidatures, retirerCandidatureAPI } from '../lib/candidatureApi';
import '../styles/ProfessionnelApplique.css';

const ProfessionnelApplique = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [candidatures, setCandidatures] = useState([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCandidatures = async () => {
      try {
        setLoading(true);
        console.log("🔍 Chargement des candidatures de l'utilisateur...");
        const response = await fetchUserCandidatures();
        console.log("📊 Réponse API:", response);

        // Transformation des données pour l'affichage
        const candidaturesList = response.map((c) => ({
          id: c.id_candidature,
          id_offre: c.id_offre,
          titre: c.Offre?.titre || 'Offre non disponible',
          clinique: c.Offre?.CliniqueDentaire?.nom_clinique || 'Clinique inconnue',
          lieu: c.Offre?.adresse_complete || '',
          logo: c.Offre?.CliniqueDentaire?.nom_clinique?.charAt(0) || 'X',
          dateCandidature: c.date_candidature,
          dateReponse: c.date_reponse || null,
          // Normalisation du statut pour un affichage cohérent
          statut: c.statut === 'accepted' || c.statut === 'acceptee' ? 'acceptee' :
                 c.statut === 'rejected' || c.statut === 'refusee' ? 'refusee' :
                 c.statut === 'pending' || c.statut === 'en_attente' ? 'en_attente' : 'reçue',
          statutLabel: c.statut === 'accepted' || c.statut === 'acceptee' ? 'Candidature acceptée' :
                      c.statut === 'rejected' || c.statut === 'refusee' ? 'Candidature refusée' :
                      c.statut === 'pending' || c.statut === 'en_attente' ? 'En cours d\'examen' : 'Candidature reçue',
          dateDébut: c.Offre?.date_debut,
          dateFin: c.Offre?.date_fin,
          salaire: c.Offre?.remuneration,
          message_personnalise: c.message_personnalise || '',
          message_reponse: c.message_reponse || '',
          dateEntretien: '',
          heureEntretien: '',
          typeEntretien: '',
          notes: c.notes || ''
        }));

        console.log("🔄 Candidatures transformées:", candidaturesList);
        setCandidatures(candidaturesList);
        setFilteredCandidatures(candidaturesList);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des candidatures:', error);
        setError('Impossible de charger vos candidatures. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    loadCandidatures();
  }, []);

  useEffect(() => {
    let result = [...candidatures];

    if (searchTerm) {
      result = result.filter(candidature =>
        candidature.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.clinique.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(candidature => candidature.statut === filterStatus);
    }

    if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.dateCandidature) - new Date(a.dateCandidature));
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.dateCandidature) - new Date(b.dateCandidature));
    } else if (sortBy === 'statut') {
      const ordreStatuts = {
        'acceptee': 1,
        'en_attente': 2,
        'reçue': 3,
        'refusee': 4
      };

      result.sort((a, b) => ordreStatuts[a.statut] - ordreStatuts[b.statut]);
    }

    setFilteredCandidatures(result);
  }, [candidatures, searchTerm, filterStatus, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-CA', options);
  };

  const navigateToDetail = (offerId) => {
    navigate(`/offres/${offerId}`);
  };

  const retirerCandidature = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir retirer cette candidature?')) {
      try {
        await retirerCandidatureAPI(id);
        setCandidatures(candidatures.filter(c => c.id !== id));
        alert('✅ Candidature retirée avec succès.');
      } catch (err) {
        console.error(err);
        alert('❌ Erreur lors du retrait de la candidature.');
      }
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'acceptee': return 'status-accepted';
      case 'en_attente': return 'status-review';
      case 'reçue': return 'status-received';
      case 'refusee': return 'status-rejected';
      default: return '';
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'acceptee': return <i className="fa-solid fa-check-circle"></i>;
      case 'en_attente': return <i className="fa-solid fa-hourglass-half"></i>;
      case 'reçue': return <i className="fa-solid fa-envelope-open"></i>;
      case 'refusee': return <i className="fa-solid fa-times-circle"></i>;
      default: return <i className="fa-solid fa-question-circle"></i>;
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
              <option value="acceptee">Candidature acceptée</option>
              <option value="en_attente">En cours d'examen</option>
              <option value="reçue">Candidature reçue</option>
              <option value="refusee">Candidature refusée</option>
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
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Chargement de vos candidatures...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <p className="results-count">
              {filteredCandidatures.length} candidature(s) trouvée(s)
            </p>
            
            {filteredCandidatures.length === 0 ? (
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
                    onClick={() => navigateToDetail(candidature.id_offre)}
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
                            <i className="fa-solid fa-money-bill-wave"></i> {candidature.salaire} $/h
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
                          {getStatusIcon(candidature.statut)}
                          <span>{candidature.statutLabel}</span>
                          {candidature.dateReponse && (
                            <span className="response-date">
                              {" "}(le {formatDate(candidature.dateReponse)})
                            </span>
                          )}
                        </div>
                        
                        {candidature.message_personnalise && (
                          <div className="message-container">
                            <div className="message-sent">
                              <p className="message-label">Votre message :</p>
                              <p className="message-content">{candidature.message_personnalise}</p>
                            </div>
                          </div>
                        )}
                        
                        {candidature.message_reponse && candidature.statut === 'refusee' && (
                          <div className="message-container">
                            <div className="message-response">
                              <p className="message-label">Réponse de la clinique :</p>
                              <p className="message-content">{candidature.message_reponse}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="candidature-actions">
                        {candidature.statut === 'acceptee' && (
                          <button 
                            className="contact-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/messagerie/${candidature.id_offre}`);
                            }}
                          >
                            <i className="fa-solid fa-comment"></i> Contacter la clinique
                          </button>
                        )}
                        {(candidature.statut === 'en_attente' || candidature.statut === 'reçue') && (
                          <button 
                            className="withdraw-button"
                            onClick={(e) => retirerCandidature(candidature.id, e)}
                          >
                            <i className="fa-solid fa-ban"></i> Retirer
                          </button>
                        )}
                        <button 
                          className="details-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToDetail(candidature.id_offre);
                          }}
                        >
                          <i className="fa-solid fa-eye"></i> Voir l'offre
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfessionnelApplique;