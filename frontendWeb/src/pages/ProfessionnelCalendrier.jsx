import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import { fetchUserCandidatures } from '../lib/candidatureApi';
import '../styles/ProfessionnelCalendrier.css';
import { useLocation } from 'react-router-dom';

const ProfessionnelCalendrier = () => {
  const navigate = useNavigate();
  // Nous n'avons plus besoin d'utiliser les données statiques de OffersContext
  
  // États pour gérer le calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);
  
  // État pour stocker les candidatures et les offres acceptées
  const [acceptedCandidatures, setAcceptedCandidatures] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  
  // Générer premier et dernier jour du mois
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Générer les jours pour remplir le calendrier (inclut les jours du mois précédent/suivant)
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
  
  const lastDayOfCalendar = new Date(lastDayOfMonth);
  const daysToAdd = 6 - lastDayOfCalendar.getDay();
  lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() + daysToAdd);
  
  // Jours de la semaine en français
  const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Mois en français
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Fonction pour déterminer si une date est aujourd'hui
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Fonction pour déterminer si une date appartient au mois courant
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };
  
  // Générer les jours du calendrier
  const calendarDays = [];
  let currentCalendarDay = new Date(firstDayOfCalendar);
  
  while (currentCalendarDay <= lastDayOfCalendar) {
    calendarDays.push(new Date(currentCalendarDay));
    currentCalendarDay.setDate(currentCalendarDay.getDate() + 1);
  }

  // Fonction pour vérifier si une date est comprise entre deux dates
  const isDateInRange = (date, startDate, endDate) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    return d >= start && d <= end;
  };

  // Fonction pour formater les heures
  const formatTime = (timeString) => {
    if (!timeString) return '09:00';
    
    // Traiter les formats de temps différents
    if (typeof timeString === 'string') {
      // Format ISO
      if (timeString.includes('T')) {
        const timePart = timeString.split('T')[1];
        return timePart.substring(0, 5);
      }
      
      // Format simple HH:MM
      if (timeString.includes(':')) {
        return timeString.substring(0, 5);
      }
    }
    
    return '09:00'; // Valeur par défaut
  };
  
  const location = useLocation();
  // Charger les candidatures acceptées du professionnel depuis l'API
  useEffect(() => {
    const loadAcceptedCandidatures = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les candidatures du professionnel
        const candidaturesData = await fetchUserCandidatures();
        console.log('Candidatures chargées:', candidaturesData);
        
        // Filtrer pour ne récupérer que les candidatures acceptées
        const accepted = candidaturesData.filter(
          candidature => candidature.statut === 'acceptee' || 
                         candidature.statut === 'accepted'
        );
        
        setAcceptedCandidatures(accepted);
        
        // Simuler quelques réunions à venir (à remplacer par un vrai appel API)
        // Dans un système réel, vous auriez une API pour récupérer les entretiens et réunions
        const today = new Date();
        const meetings = accepted.map(candidature => {
          // Créer une date d'entretien fictive (si nécessaire)
          const meetingDate = new Date(today);
          // Positionner la date d'entretien dans le mois actuel pour l'affichage
          meetingDate.setDate(Math.min(today.getDate() + 7, 28)); 
          meetingDate.setMonth(currentDate.getMonth());
          meetingDate.setFullYear(currentDate.getFullYear());
          
          return {
            id: `meeting-${candidature.id}`,
            title: 'Entretien',
            clinique: candidature.Offre?.CliniqueDentaire?.nom_clinique || 'Clinique',
            date: meetingDate,
            startTime: '14:00',
            endTime: '15:00',
            type: 'interview',
            description: `Entretien pour le poste de ${candidature.Offre?.titre || 'remplacement'}`,
            location: 'Vidéoconférence'
          };
        });
        
        setUpcomingMeetings(meetings);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des candidatures:', error);
        setLoading(false);
      }
    };
    
    // Ne charger les données qu'une seule fois au montage du composant,
    // ou si les candidatures n'ont pas encore été chargées
      loadAcceptedCandidatures();
    
  }, [location.key]);
  
  // Générer les événements du calendrier à partir des candidatures acceptées
  useEffect(() => {
    const generateEvents = () => {
      let calendarEvents = [];
      
      // Ajouter les candidatures acceptées (remplacements)
      if (acceptedCandidatures.length > 0) {
        acceptedCandidatures.forEach(candidature => {
          const offer = candidature.Offre;
          if (!offer) return;
          
          const startDate = new Date(offer.date_debut);
          const endDate = new Date(offer.date_fin);
          
          // Pour chaque jour du calendrier
          calendarDays.forEach(day => {
            // Vérifier si ce jour est dans la période du remplacement
            if (isDateInRange(day, startDate, endDate)) {
              calendarEvents.push({
                id: `job-${candidature.id}-${day.getDate()}`,
                title: offer.titre || 'Remplacement',
                clinique: offer.CliniqueDentaire?.nom_clinique || 'Clinique',
                date: new Date(day),
                startTime: formatTime(offer.heure_debut),
                endTime: formatTime(offer.heure_fin),
                type: 'job',
                description: offer.descript || 'Remplacement dentaire',
                location: offer.adresse_complete || 'Adresse non spécifiée',
                remuneration: offer.remuneration,
                profession: offer.type_professionnel
              });
            }
          });
        });
      }
      
      // Ajouter les entretiens
      upcomingMeetings.forEach(meeting => {
        // Ne pas ajouter les réunions qui ne sont pas dans le mois en cours
        if (meeting.date.getMonth() === currentDate.getMonth() &&
            meeting.date.getFullYear() === currentDate.getFullYear()) {
          calendarEvents.push(meeting);
        }
      });
      
      setEvents(calendarEvents);
    };
    
    generateEvents();
  }, [acceptedCandidatures, upcomingMeetings, calendarDays, currentDate.getMonth(), currentDate.getFullYear()]);
  
  // Filtrer les événements pour une date spécifique
  const getEventsForDay = (day) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Formatage de la date/heure
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-CA', options);
  };
  
  // Changer de mois
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };
  
  // Ouvrir les détails d'un événement
  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };
  
  // Fermer les détails d'un événement
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };
  
  // Annuler un événement (peut être implémenté avec une API réelle)
  const cancelEvent = (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cet événement ?')) {
      setEvents(events.filter(event => event.id !== eventId));
      closeEventDetails();
      
      setNotification({
        show: true,
        message: 'Événement annulé avec succès',
        type: 'warning'
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
    }
  };
  
  // Confirmer la présence à un événement
  const confirmEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, confirmed: true } 
        : event
    ));
    
    setNotification({
      show: true,
      message: 'Votre présence est confirmée',
      type: 'success'
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
    
    closeEventDetails();
  };
  
  // Obtenir la couleur d'un événement en fonction du type
  const getEventColor = (type) => {
    switch (type) {
      case 'offer':
        return 'offer';
      case 'interview':
        return 'interview';
      case 'job':
        return 'job';
      case 'call':
        return 'call';
      default:
        return '';
    }
  };
  
  return (
    <div className="professionnel-calendrier-container">
      <div className="calendrier-header">
        <h1>Mon calendrier professionnel</h1>
        <div className="calendrier-navigation">
          <button onClick={() => changeMonth(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h2 className="month-title">{months[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}</h2>
          <button onClick={() => changeMonth(1)}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du calendrier...</p>
        </div>
      ) : (
        <div className="calendrier">
          <div className="calendrier-weekdays">
            {weekDays.map((day, index) => (
              <div key={index} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendrier-days">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              
              return (
                <div 
                  key={index} 
                  className={`calendrier-day ${!isCurrentMonth(day) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
                >
                  <div className="day-number">{day.getDate()}</div>
                  <div className="day-events">
                    {dayEvents.map((event, eventIndex) => (
                      <div 
                        key={eventIndex} 
                        className={`event ${getEventColor(event.type)} ${event.confirmed ? 'confirmed' : ''}`}
                        onClick={() => openEventDetails(event)}
                      >
                        <div className="event-time">
                          {event.type === 'interview' && <i className="fa-solid fa-video"></i>}
                          {event.type === 'job' && <i className="fa-solid fa-briefcase"></i>}
                          {event.type === 'notification' && <i className="fa-solid fa-bell"></i>}
                          {event.type === 'call' && <i className="fa-solid fa-phone"></i>}
                          {event.type === 'offer' && <i className="fa-solid fa-file-contract"></i>}
                          {event.startTime}
                        </div>
                        <div className="event-title">{event.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Modal détails événement */}
      {selectedEvent && (
        <div className="event-details-modal">
          <div className="event-details-header">
            <h3>{selectedEvent.title}</h3>
            <button onClick={closeEventDetails}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <div className="event-details-content">
            {selectedEvent.type === 'job' ? (
              <>
                <p className="modal-clinique">
                  <i className="fa-solid fa-hospital"></i>
                  <strong>Clinique:</strong> {selectedEvent.clinique}
                </p>
                <p className="modal-date">
                  <i className="fa-solid fa-calendar-day"></i>
                  <strong>Date:</strong> {formatDate(selectedEvent.date)}
                </p>
                <p className="modal-time">
                  <i className="fa-regular fa-clock"></i>
                  <strong>Horaire:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
                </p>
                <p className="modal-location">
                  <i className="fa-solid fa-location-dot"></i>
                  <strong>Lieu:</strong> {selectedEvent.location}
                </p>
                <p className="modal-remuneration">
                  <i className="fa-solid fa-money-bill-wave"></i>
                  <strong>Rémunération:</strong> {selectedEvent.remuneration} $ CAD/h
                </p>
                <p className="modal-profession">
                  <i className="fa-solid fa-user-md"></i>
                  <strong>Poste:</strong> {
                    selectedEvent.profession === 'dentiste' ? 'Dentiste' :
                    selectedEvent.profession === 'assistant' ? 'Assistant(e) dentaire' : 'Hygiéniste dentaire'
                  }
                </p>
                <p className="modal-description">
                  <i className="fa-solid fa-align-left"></i>
                  <strong>Description:</strong> {selectedEvent.description}
                </p>
                
                <div className="event-details-actions">
                  <button 
                    className={`confirm-button ${selectedEvent.confirmed ? 'confirmed' : ''}`}
                    onClick={() => confirmEvent(selectedEvent.id)}
                    disabled={selectedEvent.confirmed}
                  >
                    {selectedEvent.confirmed ? 'Présence confirmée' : 'Confirmer ma présence'}
                  </button>
                  <button 
                    className="navigate-button"
                    onClick={() => {
                      const offerId = selectedEvent.id.split('-')[1];
                      navigate(`/offres/${offerId}`);
                      closeEventDetails();
                    }}
                  >
                    Voir les détails de l'offre
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="modal-clinique">
                  <i className="fa-solid fa-hospital"></i>
                  <strong>Clinique:</strong> {selectedEvent.clinique}
                </p>
                <p className="modal-date">
                  <i className="fa-solid fa-calendar-day"></i>
                  <strong>Date:</strong> {formatDate(selectedEvent.date)}
                </p>
                <p className="modal-time">
                  <i className="fa-regular fa-clock"></i>
                  <strong>Horaire:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
                </p>
                {selectedEvent.location && (
                  <p className="modal-location">
                    <i className="fa-solid fa-location-dot"></i>
                    <strong>Lieu:</strong> {selectedEvent.location}
                  </p>
                )}
                <p className="modal-description">
                  <i className="fa-solid fa-align-left"></i>
                  <strong>Description:</strong> {selectedEvent.description}
                </p>
                
                <div className="event-details-actions">
                  {selectedEvent.type === 'interview' && (
                    <>
                      <button 
                        className={`confirm-button ${selectedEvent.confirmed ? 'confirmed' : ''}`}
                        onClick={() => confirmEvent(selectedEvent.id)}
                        disabled={selectedEvent.confirmed}
                      >
                        {selectedEvent.confirmed ? 'Présence confirmée' : 'Confirmer ma présence'}
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={() => cancelEvent(selectedEvent.id)}
                      >
                        Annuler l'entretien
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProfessionnelCalendrier;