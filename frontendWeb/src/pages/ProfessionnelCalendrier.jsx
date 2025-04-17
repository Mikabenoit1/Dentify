import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/ProfessionnelCalendrier.css';

const ProfessionnelCalendrier = () => {
  const navigate = useNavigate();
  const { offers, candidates, meetings } = useOffers();
  
  // États pour gérer le calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
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
  
  // Charger les événements (entretiens, remplacements, etc.) à partir du contexte
  useEffect(() => {
    const loadEvents = () => {
      const eventsArray = [];
      
      // Ajouter les entretiens des candidatures sélectionnées
      if (candidates && offers) {
        const selectedCandidates = candidates.filter(c => c.status === 'selected');
        
        selectedCandidates.forEach(candidate => {
          const relatedOffer = offers.find(o => o.id === candidate.offerId);
          
          if (relatedOffer) {
            // Date d'entretien simulée 7 jours après la date de candidature
            const applicationDate = new Date(candidate.applicationDate);
            const interviewDate = new Date(applicationDate);
            interviewDate.setDate(interviewDate.getDate() + 7);
            
            // S'assurer que l'entretien est dans le mois actuel pour l'affichage
            interviewDate.setFullYear(currentDate.getFullYear());
            interviewDate.setMonth(currentDate.getMonth());
            
            // Conserver le jour, mais ajuster pour être dans le mois courant
            if (interviewDate.getDate() > 28) {
              interviewDate.setDate(Math.min(interviewDate.getDate(), lastDayOfMonth.getDate()));
            }
            
            eventsArray.push({
              id: candidate.id,
              title: 'Entretien',
              clinique: relatedOffer.cliniqueName,
              date: interviewDate,
              startTime: '14:00',
              endTime: '15:00',
              type: 'interview',
              description: `Entretien par vidéo pour le poste de ${relatedOffer.title}.`,
              location: 'Zoom / Vidéoconférence'
            });
          }
        });
      }
      
      // Ajouter les remplacements actifs
      if (offers) {
        const activeJobs = offers.filter(o => o.status === 'active' && o.assignedCandidate);
        
        activeJobs.forEach(job => {
          const startDate = new Date(job.startDate);
          const endDate = new Date(job.endDate);
          
          // Créer un événement pour chaque jour du remplacement dans le mois actuel
          let currentJobDay = new Date(startDate);
          
          while (currentJobDay <= endDate) {
            // Vérifier si le jour est dans le mois actuel
            if (currentJobDay.getMonth() === currentDate.getMonth() && 
                currentJobDay.getFullYear() === currentDate.getFullYear()) {
              
              eventsArray.push({
                id: `job-${job.id}-${currentJobDay.getDate()}`,
                title: 'Remplacement',
                clinique: job.cliniqueName,
                date: new Date(currentJobDay),
                startTime: job.startTime || '09:00',
                endTime: job.endTime || '17:00',
                type: 'job',
                description: job.title,
                location: job.location
              });
            }
            
            // Passer au jour suivant
            currentJobDay.setDate(currentJobDay.getDate() + 1);
          }
        });
      }
      
      // Ajouter les rendez-vous du contexte s'ils existent
      if (meetings && meetings.length > 0) {
        meetings.forEach(meeting => {
          const meetingDate = new Date(meeting.date);
          
          // Vérifier si le rendez-vous est dans le mois actuel
          if (meetingDate.getMonth() === currentDate.getMonth() && 
              meetingDate.getFullYear() === currentDate.getFullYear()) {
            
            eventsArray.push({
              id: `meeting-${meeting.id}`,
              title: meeting.title,
              clinique: meeting.cliniqueName,
              date: meetingDate,
              startTime: meeting.startTime,
              endTime: meeting.endTime,
              type: meeting.type || 'call',
              description: meeting.description,
              location: meeting.location
            });
          }
        });
      }
      
      // Ajouter quelques événements simulés pour avoir plus de contenu
      const today = new Date();
      
      // Confirmation de candidature
      const confirmationDate = new Date(today);
      confirmationDate.setDate(confirmationDate.getDate() - 3);
      confirmationDate.setMonth(currentDate.getMonth());
      
      eventsArray.push({
        id: 'notification-1',
        title: 'Confirmation candidature',
        clinique: 'Cabinet Elite Dental',
        date: confirmationDate,
        startTime: '11:00',
        endTime: '11:15',
        type: 'notification',
        description: 'Confirmation de la réception de votre candidature pour le poste d\'hygiéniste.'
      });
      
      // Appel téléphonique
      const callDate = new Date(today);
      callDate.setDate(callDate.getDate() - 5);
      callDate.setMonth(currentDate.getMonth());
      
      eventsArray.push({
        id: 'call-1',
        title: 'Appel téléphonique',
        clinique: 'Clinique Dentaire Familiale',
        date: callDate,
        startTime: '10:30',
        endTime: '11:00',
        type: 'call',
        description: 'Discussion sur les détails du contrat et les conditions de travail.',
        location: 'Via téléphone'
      });
      
      setEvents(eventsArray);
    };
    
    loadEvents();
  }, [currentDate, offers, candidates, meetings]);
  
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
  
  // Annuler un événement
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
    switch(type) {
      case 'interview':
        return 'event-interview';
      case 'job':
        return 'event-job';
      case 'notification':
        return 'event-notification';
      case 'call':
        return 'event-call';
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
      
      {/* Modal détails événement */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={closeEventDetails}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h3>{selectedEvent.title}</h3>
              <span className={`event-type-badge ${getEventColor(selectedEvent.type)}`}>
                {selectedEvent.type === 'interview' && 'Entretien'}
                {selectedEvent.type === 'job' && 'Remplacement'}
                {selectedEvent.type === 'notification' && 'Notification'}
                {selectedEvent.type === 'call' && 'Appel'}
              </span>
              <button className="close-button" onClick={closeEventDetails}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="event-modal-content">
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
              
              <div className="event-modal-actions">
                {selectedEvent.type === 'interview' && !selectedEvent.confirmed && (
                  <button 
                    className="confirm-button"
                    onClick={() => confirmEvent(selectedEvent.id)}
                  >
                    <i className="fa-solid fa-check"></i> Confirmer ma présence
                  </button>
                )}
                
                {selectedEvent.type !== 'notification' && (
                  <button 
                    className="cancel-button"
                    onClick={() => cancelEvent(selectedEvent.id)}
                  >
                    <i className="fa-solid fa-ban"></i> Annuler
                  </button>
                )}
                
                <button 
                  className="close-modal-button"
                  onClick={closeEventDetails}
                >
                  <i className="fa-solid fa-xmark"></i> Fermer
                </button>
              </div>
            </div>
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