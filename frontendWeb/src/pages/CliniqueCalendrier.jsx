import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import ScheduleMeeting from '../components/ScheduleMeeting'; // Import du composant pour planifier un RDV
import '../styles/CliniqueCalendrier.css';

const CliniqueCalendrier = () => {
  const navigate = useNavigate();
  const { offers, meetings, addMeeting, deleteMeeting } = useOffers();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // État pour la modal de planification de rendez-vous
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  // État pour afficher une notification
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Générer le premier et dernier jour du mois
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Générer les jours du calendrier, y compris les jours du mois précédent et suivant pour compléter les semaines
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
  
  const lastDayOfCalendar = new Date(lastDayOfMonth);
  const daysToAdd = 6 - lastDayOfCalendar.getDay();
  lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() + daysToAdd);
  
  // Générer les noms des jours de la semaine en français
  const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Générer les noms des mois en français
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Fonction pour vérifier si une date est aujourd'hui
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Fonction pour vérifier si une date appartient au mois actuel
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

  // Fonction pour vérifier si une date est comprise entre la date de début et la date de fin
  const isDateInRange = (date, startDate, endDate) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    return d >= start && d <= end;
  };

  // Fonction pour convertir les offres en événements du calendrier
  const generateCalendarEvents = () => {
    let events = [];
    
    // Ajouter les offres comme événements
    offers.forEach(offer => {
      if (!offer.startDate || !offer.endDate) return;
      
      const startDate = new Date(offer.startDate);
      const endDate = new Date(offer.endDate);
      
      // Définir la couleur en fonction du statut
      let color;
      switch (offer.status) {
        case 'active':
          color = '#6a9174'; // Vert
          break;
        case 'pending':
          color = '#f0ad4e'; // Orange
          break;
        case 'expired':
          color = '#888'; // Gris
          break;
        default:
          color = '#6a9174';
      }
      
      // Pour chaque jour du calendrier
      calendarDays.forEach(day => {
        // Vérifier si ce jour est dans la période de l'offre
        if (isDateInRange(day, startDate, endDate)) {
          events.push({
            id: offer.id,
            title: offer.title,
            date: new Date(day),
            startTime: offer.startTime,
            endTime: offer.endTime,
            status: offer.status,
            color: color,
            profession: offer.profession,
            type: 'offer' // Marquer comme une offre
          });
        }
      });
    });
    
    // Ajouter les rendez-vous comme événements
    if (meetings && meetings.length > 0) {
      meetings.forEach(meeting => {
        if (!meeting.date) return;
        
        const meetingDate = new Date(meeting.date);
        
        // Définir une couleur pour les rendez-vous (bleu)
        const color = '#34a9d7';
        
        events.push({
          id: meeting.id,
          title: meeting.title,
          date: meetingDate,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          status: meeting.status || 'scheduled',
          color: color,
          candidatName: meeting.candidatName,
          candidatId: meeting.candidatId,
          offerId: meeting.offerId,
          meetingType: meeting.meetingType,
          notes: meeting.notes,
          type: 'meeting' // Marquer comme un rendez-vous
        });
      });
    }
    
    return events;
  };

  // Mettre à jour les événements du calendrier quand les offres ou les rendez-vous changent
  useEffect(() => {
    setCalendarEvents(generateCalendarEvents());
  }, [offers, meetings, currentDate]);

  // Afficher les détails d'un événement
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Fermer la modal de détails
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Naviguer vers la modification de l'offre
  const navigateToEditOffer = (id) => {
    navigate(`/clinique-cree/${id}`);
    closeEventDetails();
  };

  // Changer de mois (précédent ou suivant)
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };
  
  // Annuler un rendez-vous
  const handleCancelMeeting = (meetingId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      deleteMeeting(meetingId);
      closeEventDetails();
      
      // Afficher une notification
      setNotification({
        show: true,
        message: 'Rendez-vous annulé avec succès',
        type: 'warning'
      });
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
    }
  };

  // Rendre l'icône appropriée en fonction du type de rendez-vous
  const renderMeetingTypeIcon = (meetingType) => {
    switch (meetingType) {
      case 'video':
        return <i className="fa-solid fa-video event-type-icon"></i>;
      case 'phone':
        return <i className="fa-solid fa-phone event-type-icon"></i>;
      case 'inPerson':
        return <i className="fa-solid fa-user event-type-icon"></i>;
      default:
        return null;
    }
  };
  
  // Ouvrir la modal de planification de rendez-vous
  const openScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };
  
  // Fonction pour gérer la planification d'un rendez-vous
  const handleScheduleMeeting = (meetingData) => {
    // Ajouter le rendez-vous
    const newMeeting = addMeeting(meetingData);
    
    // Fermer la modal
    setIsScheduleModalOpen(false);
    
    // Afficher une notification
    setNotification({
      show: true,
      message: 'Rendez-vous planifié avec succès',
      type: 'success'
    });
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
    
    // Mettre à jour les événements du calendrier
    setCalendarEvents(generateCalendarEvents());
  };

  return (
    <div className="clinique-calendrier-container">
      <div className="calendar-header">
        <h1>Calendrier des Remplacements</h1>
        <div className="calendar-navigation">
          <button onClick={() => changeMonth(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h2 className="month-title">{months[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}</h2>
          <button onClick={() => changeMonth(1)}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div className="header-buttons">
          <button 
            className="schedule-meeting-button"
            onClick={openScheduleModal}
          >
            <i className="fa-solid fa-calendar-plus"></i> Créer un rendez-vous
          </button>
          <button 
            className="create-button"
            onClick={() => navigate('/clinique-cree')}
          >
            <i className="fa-solid fa-plus"></i> Nouvelle offre
          </button>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-weekdays">
          {weekDays.map((day, index) => (
            <div key={index} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {calendarDays.map((day, index) => {
            // Filtrer les événements pour ce jour
            const dayEvents = calendarEvents.filter(event => 
              event.date.getDate() === day.getDate() && 
              event.date.getMonth() === day.getMonth() && 
              event.date.getFullYear() === day.getFullYear()
            );
            
            return (
              <div 
                key={index} 
                className={`calendar-day ${!isCurrentMonth(day) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
              >
                <div className="day-number">{day.getDate()}</div>
                <div className="day-events">
                  {dayEvents.map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className={`event ${event.type === 'meeting' ? 'meeting' : ''}`}
                      style={{ backgroundColor: event.color }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-time">
                        {event.type === 'meeting' && renderMeetingTypeIcon(event.meetingType)}
                        {event.startTime} - {event.endTime}
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
      
      {/* Modal pour les détails d'un événement */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={closeEventDetails}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h3>{selectedEvent.title}</h3>
              <span 
                className={`status-badge ${selectedEvent.status}`}
              >
                {selectedEvent.type === 'meeting' ? 'Rendez-vous' : 
                  selectedEvent.status === 'active' ? 'Active' : 
                  selectedEvent.status === 'pending' ? 'En attente' : 'Expirée'}
              </span>
              <button className="close-button" onClick={closeEventDetails}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="event-modal-content">
              <p>
                <strong>Date:</strong> {selectedEvent.date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p>
                <strong>Horaire:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
              </p>
              
              {selectedEvent.type === 'meeting' ? (
                <>
                  <p>
                    <strong>Avec:</strong> {selectedEvent.candidatName}
                  </p>
                  <p>
                    <strong>Type de rencontre:</strong> {
                      selectedEvent.meetingType === 'video' ? 'Vidéoconférence' :
                      selectedEvent.meetingType === 'phone' ? 'Appel téléphonique' : 'En personne'
                    }
                  </p>
                  {selectedEvent.notes && (
                    <p>
                      <strong>Notes:</strong> {selectedEvent.notes}
                    </p>
                  )}
                  <div className="event-modal-buttons">
                    <button 
                      className="ok-button"
                      onClick={closeEventDetails}
                    >
                      <i className="fa-solid fa-check"></i> OK
                    </button>
                    <button 
                      className="cancel-meeting-button"
                      onClick={() => handleCancelMeeting(selectedEvent.id)}
                    >
                      <i className="fa-solid fa-ban"></i> Annuler le rendez-vous
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Profession:</strong> {selectedEvent.profession === 'dentiste' ? 'Dentiste' : 
                                                  selectedEvent.profession === 'assistant' ? 'Assistant(e) dentaire' : 
                                                  'Hygiéniste dentaire'}
                  </p>
                  <div className="event-modal-buttons">
                    <button 
                      className="view-details-button"
                      onClick={() => {
                        navigate(`/clinique-offres/${selectedEvent.id}`);
                        closeEventDetails();
                      }}
                    >
                      <i className="fa-solid fa-eye"></i> Voir les détails
                    </button>
                    <button 
                      className="edit-button"
                      onClick={() => navigateToEditOffer(selectedEvent.id)}
                    >
                      <i className="fa-solid fa-pen"></i> Modifier l'offre
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de planification de rendez-vous */}
      <ScheduleMeeting
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleMeeting}
      />
      
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i> {notification.message}
        </div>
      )}
    </div>
  );
};

export default CliniqueCalendrier;