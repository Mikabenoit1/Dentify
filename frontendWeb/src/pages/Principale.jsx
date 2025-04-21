import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/Principale.css';
import { fetchUserCandidatures } from '../lib/candidatureApi';
import { apiFetch } from '../lib/apiFetch';

const Principale = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [stats, setStats] = useState({
    applicationsEnvoyees: 0,
    entretiensPrevus: 0,
    offresDisponibles: 0,
    offresConsultees: 0
  });
  
  const [offresTendance, setOffresTendance] = useState([]);
  const [entretiensAVenir, setEntretiensAVenir] = useState([]);
  const [messagesRecents, setMessagesRecents] = useState([]);
  const [offresEnAttente, setOffresEnAttente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chargement des offres et mise à jour des offres en tendance
  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Récupérer toutes les offres sans filtre via l'API
        const offresApi = await apiFetch('/offres');
        console.log("Offres chargées:", offresApi?.length || 0);
        
        // DEBUG - Vérifier la structure de la première offre pour comprendre les propriétés disponibles
        if (offresApi && offresApi.length > 0) {
          console.log("Structure d'une offre:", JSON.stringify(offresApi[0], null, 2));
          
          // Compter toutes les offres (ne pas filtrer par statut pour l'instant)
          const activeOffersCount = offresApi.length;
          console.log("Nombre total d'offres:", activeOffersCount);
          
          // Mettre à jour le compteur d'offres disponibles avec le nombre total
          setStats(prev => ({
            ...prev,
            offresDisponibles: activeOffersCount
          }));
          
          // Prendre les 3 offres les plus récentes pour l'affichage en tendance
          const sortedOffers = [...offresApi].sort((a, b) => {
            // Utiliser date_publication si disponible, sinon utiliser un timestamp récent
            const dateA = a.date_publication ? new Date(a.date_publication) : new Date();
            const dateB = b.date_publication ? new Date(b.date_publication) : new Date();
            return dateB - dateA;
          });
          
          const recentOffers = sortedOffers.slice(0, 3).map((offer, index) => {
            // Afficher toutes les propriétés disponibles pour débugger le nom de la clinique
            console.log(`Offre #${index+1}:`, {
              id: offer.id_offre,
              titre: offer.titre,
              clinique: offer.clinique || offer.nom_clinique || offer.Clinique?.nom || "Voir la structure complète",
              id_clinique: offer.id_clinique
            });
            
            // Essayer d'obtenir le nom de la clinique avec différentes stratégies
            let nomClinique = "Clinique";
            
            if (offer.Clinique?.nom) {
              nomClinique = offer.Clinique.nom;
            } else if (offer.nom_clinique) {
              nomClinique = offer.nom_clinique;
            } else if (offer.clinique) {
              nomClinique = offer.clinique;
            } else if (offer.CliniqueDentaire?.nom_clinique) {
              nomClinique = offer.CliniqueDentaire.nom_clinique;
            }
            
            // Assigner des statuts différents aux 3 premières offres pour l'affichage
            const statusMap = ['nouveau', 'populaire', 'vedette'];
            
            return {
              id: offer.id_offre,
              titre: offer.titre || "Offre sans titre",
              clinique: nomClinique,
              lieu: offer.adresse_complete || offer.lieu || 'Non spécifié',
              dateDébut: offer.date_debut,
              dateFin: offer.date_fin,
              salaire: offer.remuneration ? `${offer.remuneration} €` : 'Non spécifié',
              datePublication: offer.date_publication,
              status: statusMap[index] || 'nouveau'
            };
          });
          
          console.log("Offres en tendance préparées:", recentOffers.length);
          setOffresTendance(recentOffers);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des offres:", err);
        setError("Erreur lors du chargement des offres");
        setLoading(false);
      }
    };
    
    loadOffers();
  }, []);
  
  // Charger les candidatures et autres statistiques
  useEffect(() => {
    const loadCandidatures = async () => {
      try {
        const userCandidatures = await fetchUserCandidatures();
        console.log("Candidatures chargées:", userCandidatures?.length || 0);
        
        if (userCandidatures) {
          // Nombre total de candidatures
          const totalCandidatures = userCandidatures.length;
          
          // Nombre d'entretiens prévus (candidatures avec statut selected)
          const entretiensPrevus = userCandidatures.filter(c => 
            c.statut === 'selected' || c.statut === 'interview'
          ).length;
          
          // Estimation du nombre d'offres consultées
          let offresConsultees = parseInt(localStorage.getItem('offresConsultees')) || 0;
          if (offresConsultees === 0) {
            // Calculer une estimation basée sur les candidatures et les offres disponibles
            offresConsultees = Math.max((totalCandidatures * 3) + 5, stats.offresDisponibles * 2);
            localStorage.setItem('offresConsultees', offresConsultees.toString());
          }
          
          // Mettre à jour les statistiques
          setStats(prev => ({
            ...prev,
            applicationsEnvoyees: totalCandidatures,
            entretiensPrevus: entretiensPrevus,
            offresConsultees: offresConsultees
          }));
          
          // Si des candidatures sont disponibles, vérifier leur structure pour déboguer
          if (userCandidatures.length > 0) {
            console.log("Structure d'une candidature:", JSON.stringify(userCandidatures[0], null, 2));
          }
          
          // Filtrer et formater les candidatures en attente
          const candidaturesEnAttente = userCandidatures
            .filter(c => c.statut !== 'rejected')
            .slice(0, 3)
            .map(c => {
              // Tenter de récupérer le nom de la clinique de différentes manières
              let nomClinique = "Clinique inconnue";
              if (c.Offre?.Clinique?.nom) nomClinique = c.Offre.Clinique.nom;
              else if (c.Offre?.Clinique?.nom_clinique) nomClinique = c.Offre.Clinique.nom_clinique;
              else if (c.Offre?.nom_clinique) nomClinique = c.Offre.nom_clinique;
              else if (c.Offre?.clinique) nomClinique = c.Offre.clinique;
              
              return {
                id: c.id_candidature,
                titre: c.Offre?.titre || 'Offre non disponible',
                clinique: nomClinique,
                dateCandidature: c.date_candidature,
                statut: c.statut === 'accepted' ? 'Offre acceptée' :
                       c.statut === 'selected' ? 'Entretien prévu' :
                       c.statut === 'rejected' ? 'Non retenu' :
                       c.statut === 'pending' ? 'En cours d\'examen' : 'Candidature reçue'
              };
            });
          
          setOffresEnAttente(candidaturesEnAttente);
          
          // Générer des messages basés sur les candidatures
          const messages = userCandidatures
            .slice(0, 3)
            .map((candidature, index) => {
              let content = '';
              const messageDateObj = new Date(candidature.date_candidature);
              
              if (candidature.statut === 'selected') {
                content = `Bonjour, suite à votre candidature pour le poste de ${candidature.Offre?.titre || 'remplacement'}, nous aimerions planifier un entretien...`;
              } else if (candidature.statut === 'pending') {
                content = `Nous avons bien reçu votre candidature pour le poste de ${candidature.Offre?.titre || 'remplacement'}. Nous l'examinerons attentivement et reviendrons vers vous rapidement.`;
              } else {
                content = `Merci pour votre candidature. Votre profil a retenu notre attention et nous souhaiterions vous rencontrer...`;
              }
              
              // Tenter de récupérer le nom de la clinique de différentes manières
              let nomClinique = "Clinique inconnue";
              if (candidature.Offre?.Clinique?.nom) nomClinique = candidature.Offre.Clinique.nom;
              else if (candidature.Offre?.Clinique?.nom_clinique) nomClinique = candidature.Offre.Clinique.nom_clinique;
              else if (candidature.Offre?.nom_clinique) nomClinique = candidature.Offre.nom_clinique;
              else if (candidature.Offre?.clinique) nomClinique = candidature.Offre.clinique;
              else nomClinique = `Clinique ${index + 1}`;
              
              const avatar = nomClinique.charAt(0);
              
              return {
                id: candidature.id_candidature,
                expediteur: nomClinique,
                avatar: avatar,
                contenu: content,
                nonLu: index < 2,
                date: messageDateObj.toISOString(),
                conversationId: candidature.id_candidature
              };
            });
          
          setMessagesRecents(messages);
          
          // Générer des entretiens basés sur les candidatures avec statut "Entretien prévu"
          const entretiens = candidaturesEnAttente
            .filter(offre => offre.statut === 'Entretien prévu')
            .map((offre, index) => {
              // Générer une date proche pour l'entretien
              const today = new Date();
              const interviewDate = new Date(today);
              interviewDate.setDate(today.getDate() + (index + 1) * 2);
              
              // Types d'entretien possibles
              const types = ['video', 'téléphone', 'présentiel'];
              
              return {
                id: offre.id,
                clinique: offre.clinique,
                poste: offre.titre,
                date: interviewDate.toISOString().split('T')[0],
                heure: `${10 + (index * 2)}:${index % 2 === 0 ? '00' : '30'}`,
                type: types[index % 3]
              };
            });
          
          setEntretiensAVenir(entretiens);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des candidatures:", err);
      }
    };
    
    loadCandidatures();
  }, [stats.offresDisponibles]);

  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-CA', options);
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return dateString;
    }
  };

  // Navigation
  const navigateTo = (path) => {
    navigate(path);
  };
  
  // Formatage de l'heure pour les messages
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const today = new Date();
      
      // Si le message date d'aujourd'hui, afficher l'heure
      if (date.toDateString() === today.toDateString()) {
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
      
      // Sinon, afficher la date au format court
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } catch (e) {
      console.error("Erreur de formatage d'heure:", e);
      return '';
    }
  };
  
  return (
    <div className="principale-container">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p className="welcome-message">Bienvenue sur votre espace professionnel</p>
      </div>

      {/* Cartes des statistiques */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.applicationsEnvoyees}</h3>
            <p>Candidatures envoyées</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.entretiensPrevus}</h3>
            <p>Entretiens prévus</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-briefcase"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.offresDisponibles}</h3>
            <p>Offres disponibles</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa-solid fa-eye"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.offresConsultees}</h3>
            <p>Offres consultées</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-row">
        {/* Section des offres en tendance */}
        <div className="dashboard-section offres-section">
          <div className="section-header">
            <h2>Offres en tendance</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/offres')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            <div className="scrollable-content">
              <div className="offres-tendance">
                {loading ? (
                  <p>Chargement des offres...</p>
                ) : error ? (
                  <p>Erreur lors du chargement des offres</p>
                ) : offresTendance.length > 0 ? (
                  offresTendance.map(offre => (
                    <div key={offre.id} className={`offre-card ${offre.status}`}>
                      <div className="offre-header">
                        <h3>{offre.titre}</h3>
                        {offre.status === 'nouveau' && (
                          <span className="status-badge nouveau">Nouveau</span>
                        )}
                        {offre.status === 'populaire' && (
                          <span className="status-badge populaire">Populaire</span>
                        )}
                        {offre.status === 'vedette' && (
                          <span className="status-badge vedette">Vedette</span>
                        )}
                      </div>
                      <div className="offre-info">
                        <p className="offre-clinique">
                          <i className="fa-solid fa-hospital"></i> {offre.clinique}
                        </p>
                        <p className="offre-lieu">
                          <i className="fa-solid fa-location-dot"></i> {offre.lieu}
                        </p>
                        <p className="offre-date">
                          <i className="fa-solid fa-calendar"></i> Du {formatDate(offre.dateDébut)} au {formatDate(offre.dateFin)}
                        </p>
                        <p className="offre-salaire">
                          <i className="fa-solid fa-money-bill-wave"></i> {offre.salaire}
                        </p>
                      </div>
                      <div className="offre-actions">
                        <button 
                          className="view-details-button"
                          onClick={() => navigateTo(`/offres/${offre.id}`)}
                        >
                          <i className="fa-solid fa-eye"></i> Détails
                        </button>
                        <button className="save-button">
                          <i className="fa-regular fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucune offre disponible pour le moment</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Section des entretiens à venir */}
        <div className="dashboard-section entretiens-section">
          <div className="section-header">
            <h2>Entretiens à venir</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/calendrier')}
            >
              Calendrier
            </button>
          </div>
          
          <div className="section-content">
            {entretiensAVenir.length > 0 ? (
              <div className="scrollable-content">
                <div className="entretiens-liste">
                  {entretiensAVenir.map(entretien => (
                    <div key={entretien.id} className="entretien-card">
                      <div className="entretien-date">
                        <span className="day">{new Date(entretien.date).getDate()}</span>
                        <span className="month">{new Date(entretien.date).toLocaleDateString('fr-CA', { month: 'short' })}</span>
                      </div>
                      <div className="entretien-details">
                        <h3>{entretien.clinique}</h3>
                        <p className="entretien-poste">
                          <i className="fa-solid fa-user-tie"></i> {entretien.poste}
                        </p>
                        <p className="entretien-time">
                          <i className="fa-regular fa-clock"></i> {entretien.heure}
                        </p>
                        <p className="entretien-type">
                          {entretien.type === 'video' ? (
                            <><i className="fa-solid fa-video"></i> Entretien vidéo</>
                          ) : entretien.type === 'téléphone' ? (
                            <><i className="fa-solid fa-phone"></i> Appel téléphonique</>
                          ) : (
                            <><i className="fa-solid fa-building"></i> Entretien en personne</>
                          )}
                        </p>
                      </div>
                      <div className="entretien-actions">
                        <button className="preparer-button">
                          <i className="fa-solid fa-clipboard-check"></i> Préparer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Vous n'avez pas d'entretiens prévus pour le moment.</p>
                <button 
                  className="explore-button"
                  onClick={() => navigateTo('/offres')}
                >
                  <i className="fa-solid fa-search"></i> Explorer les offres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-secondary-row">
        {/* Section des messages récents */}
        <div className="dashboard-section messages-section">
          <div className="section-header">
            <h2>Messages récents</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/messagerie')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            <div className="scrollable-content">
              <div className="messages-liste">
                {messagesRecents.length > 0 ? (
                  messagesRecents.map(message => (
                    <div 
                      key={message.id} 
                      className={`message-card ${message.nonLu ? 'non-lu' : ''}`}
                      onClick={() => navigateTo(`/messagerie/${message.conversationId}`)}
                    >
                      <div className="message-avatar">{message.avatar}</div>
                      <div className="message-content">
                        <div className="message-header">
                          <h3>{message.expediteur}</h3>
                          <span className="message-time">{formatMessageTime(message.date)}</span>
                        </div>
                        <p>{message.contenu.length > 60 ? message.contenu.substring(0, 60) + '...' : message.contenu}</p>
                      </div>
                      {message.nonLu && <div className="non-lu-badge"></div>}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>Aucun message récent.</p>
                    <button 
                      className="explore-button"
                      onClick={() => navigateTo('/messagerie')}
                    >
                      <i className="fa-solid fa-envelope"></i> Voir la messagerie
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Section des candidatures en attente */}
        <div className="dashboard-section candidatures-section">
          <div className="section-header">
            <h2>Mes candidatures</h2>
            <button 
              className="section-action-button"
              onClick={() => navigateTo('/applique')}
            >
              Voir tout
            </button>
          </div>
          
          <div className="section-content">
            <div className="scrollable-content">
              <div className="candidatures-liste">
                {offresEnAttente.length > 0 ? (
                  offresEnAttente.map(offre => (
                    <div key={offre.id} className="candidature-card">
                      <div className="candidature-info">
                        <h3>{offre.titre}</h3>
                        <p className="candidature-clinique">
                          <i className="fa-solid fa-hospital"></i> {offre.clinique}
                        </p>
                        <p className="candidature-date">
                          <i className="fa-solid fa-calendar-check"></i> Postuler le {formatDate(offre.dateCandidature)}
                        </p>
                      </div>
                      <div className="candidature-status">
                        <span className={`status-badge ${offre.statut === 'Entretien prévu' ? 'success' : offre.statut === 'En cours d\'examen' ? 'warning' : 'info'}`}>
                          {offre.statut}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>Vous n'avez pas encore postulé à des offres.</p>
                    <button 
                      className="explore-button"
                      onClick={() => navigateTo('/offres')}
                    >
                      <i className="fa-solid fa-search"></i> Explorer les offres
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="quick-action-buttons">
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/offres')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <span>Explorer les offres</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/applique')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <span>Mes candidatures</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/calendrier')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-calendar-alt"></i>
            </div>
            <span>Calendrier</span>
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigateTo('/messagerie')}
          >
            <div className="action-icon">
              <i className="fa-solid fa-comment-dots"></i>
            </div>
            <span>Messagerie</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Principale;