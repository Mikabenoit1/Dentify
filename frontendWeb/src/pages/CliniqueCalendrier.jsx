import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import ScheduleMeeting from '../components/ScheduleMeeting';
import { fetchOffersForClinic } from '../lib/offerApi'; // Import de la fonction pour récupérer les offres
import '../styles/CliniqueCalendrier.css';

const CliniqueCalendrier = () => {
  const navigate = useNavigate();
  const { meetings, addMeeting, deleteMeeting } = useOffers();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  // État pour stocker les offres depuis l'API
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Générer le premier et dernier jour du mois
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Générer les jours du calendrier
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
  
  const lastDayOfCalendar = new Date(lastDayOfMonth);
  const daysToAdd = 6 - lastDayOfCalendar.getDay();
  lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() + daysToAdd);
  
  // Noms des jours et des mois en français
  const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
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

  // Charger les offres depuis l'API au chargement du composant et quand le mois change
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const offersData = await fetchOffersForClinic();
        console.log('Offres chargées depuis l\'API:', offersData);
        setOffers(offersData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
        setLoading(false);
      }
    };

    loadOffers();
  }, [currentDate.getMonth(), currentDate.getFullYear()]);

  // Fonction pour normaliser les états des offres pour la cohérence
  const normalizeOfferStatus = (status) => {
    if (!status) return 'pending';
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'actif' || statusLower === 'active') return 'active';
    if (statusLower === 'pending' || statusLower === 'en attente' || statusLower === 'en_attente') return 'pending';
    if (statusLower === 'expired' || statusLower === 'expirée' || statusLower === 'expiree') return 'expired';
    
    return 'pending'; // Par défaut
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

  // Fonction pour convertir les offres en événements du calendrier
  const generateCalendarEvents = () => {
    let events = [];
    
    // Ajouter les offres comme événements
    if (offers && offers.length > 0) {
      offers.forEach(offer => {
        // Récupérer les dates de début et de fin (en tenant compte des différents formats possibles)
        const startDate = offer.date_debut ? new Date(offer.date_debut) : null;
        const endDate = offer.date_fin ? new Date(offer.date_fin) : null;
        
        if (!startDate || !endDate) return;
        
        // Définir la couleur en fonction du statut
        const status = normalizeOfferStatus(offer.statut || offer.status);
        let color;
        switch (status) {
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
              id: offer.id_offre || offer.id,
              title: offer.titre || offer.title,
              date: new Date(day),
              startTime: formatTime(offer.heure_debut || offer.startTime),
              endTime: formatTime(offer.heure_fin || offer.endTime),
              status: status,
              color: color,
              profession: offer.type_professionnel || offer.profession,
              description: offer.descript || offer.description,
              type: 'offer' // Marquer comme une offre
            });
          }
        });
      });
    }
    
    // Ajouter les rendez-vous comme événements
    if (meetings && meetings.length > 0) {
      meetings.forEach(meeting => {
        if (!meeting.date) return;
        
        const meetingDate = new Date(meeting.date);
        
        // Définir une couleur pour les rendez-vous (bleu)
        const color = '#34a9d7';
        
        // Vérifier si le rendez-vous est dans le mois actuel
        if (meetingDate.getMonth() === currentDate.getMonth() && 
            meetingDate.getFullYear() === currentDate.getFullYear()) {
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
        }
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

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du calendrier...</p>
        </div>
      ) : (
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
      )}
      
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
                  {selectedEvent.description && (
                    <p>
                      <strong>Description:</strong> {selectedEvent.description}
                    </p>
                  )}
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