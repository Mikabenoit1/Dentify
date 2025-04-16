import React, { createContext, useState, useContext } from 'react';

// Types exportés
export type Offer = {
  id: number;
  title: string;
  price: string;
  clinic: string;
  duration: string;
  rating: string;
  distance: string;
  date: string;
  time: string;
  patient: string;
  accepted: boolean;
};

export type Appointment = {
  id: number;
  date: string;
  displayDate: string;
  time: string;
  patient: string;
  procedure: string;
};

export type NotificationType = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type?: 'offer' | 'appointment' | 'system';
  relatedId?: number;
};

export type ReviewType = {
  id: number;
  appointmentId: number;
  ratings: number[];
  comment: string;
  date: string;
  patientName: string;
  procedure: string;
};

type AppContextType = {
  offers: Offer[];
  appointments: Appointment[];
  notifications: NotificationType[];
  reviews: ReviewType[];
  acceptOffer: (offerId: number) => void;
  cancelAppointment: (appointmentId: number) => void;
  reloadOffers: () => void;
  addNotification: (notification: Omit<NotificationType, 'id' | 'read' | 'date'>) => void;
  markNotificationAsRead: (id: number) => void;
  clearAllNotifications: () => void;
  addReview: (review: Omit<ReviewType, 'id' | 'date'>) => void;
  getReviewsForAppointment: (appointmentId: number) => ReviewType[];
};

const AppContext = createContext<AppContextType>({
  offers: [],
  appointments: [],
  notifications: [],
  reviews: [],
  acceptOffer: () => {},
  cancelAppointment: () => {},
  reloadOffers: () => {},
  addNotification: () => {},
  markNotificationAsRead: () => {},
  clearAllNotifications: () => {},
  addReview: () => {},
  getReviewsForAppointment: () => [],
});

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // États initiaux complets avec toutes les offres
  const initialOffers: Offer[] = [
    {
      id: 1,
      title: "Détartrage complet",
      price: "135$",
      clinic: "Avenue Sourire",
      duration: "45 min",
      rating: "4.8",
      distance: "1.2 km",
      date: "2025-04-05",
      time: "09:45 - 10:30",
      patient: "Jean Dupont",
      accepted: false
    },
    {
      id: 2,
      title: "Blanchiment dentaire",
      price: "250$",
      clinic: "hellodent",
      duration: "1h30",
      rating: "4.6",
      distance: "2.5 km",
      date: "2025-04-08",
      time: "14:00 - 15:30",
      patient: "Marie Martin",
      accepted: false
    },
    {
      id: 3,
      title: "Consultation d'urgence",
      price: "76$",
      clinic: "Urgence dentaire Montreal",
      duration: "30 min",
      rating: "4.2",
      distance: "0.8 km",
      date: "2025-04-04",
      time: "10:30 - 11:00",
      patient: "Mohamed Yasser",
      accepted: false
    },
    {
      id: 4,
      title: "Détartrage complet",
      price: "135$",
      clinic: "Avenue Sourire",
      duration: "45 min",
      rating: "4.8",
      distance: "1.2 km",
      date: "2025-04-10",
      time: "09:45 - 10:30",
      patient: "Sophie Martin",
      accepted: false
    },
    {
      id: 5,
      title: "Implant dentaire",
      price: "1200$",
      clinic: "Clinique Dentaire VIP",
      duration: "2h",
      rating: "4.9",
      distance: "3.1 km",
      date: "2025-04-12",
      time: "13:00 - 15:00",
      patient: "Pierre Lambert",
      accepted: false
    }
  ];

  const initialAppointments: Appointment[] = [
    {
      id: 1,
      date: "2025-04-02",
      displayDate: "mercredi 2 avril 2025",
      time: "14:00 - 17:00",
      patient: "Sophie Martin",
      procedure: "Détartrage"
    },
    {
      id: 2,
      date: "2025-03-28",
      displayDate: "vendredi 28 mars 2025",
      time: "10:00 - 11:00",
      patient: "Luc Tremblay",
      procedure: "Consultation"
    }
  ];

  const initialNotifications: NotificationType[] = [
    {
      id: 1,
      title: "Quart terminé",
      message: "Votre quart avec Sophie Martin est terminé",
      date: new Date('2025-04-02T17:05:00').toISOString(),
      read: false,
      type: 'appointment',
      relatedId: 1
    },
    {
      id: 2,
      title: "Nouvelle offre disponible",
      message: "Une nouvelle offre de détartrage est disponible",
      date: new Date('2025-04-03T09:15:00').toISOString(),
      read: false,
      type: 'offer',
      relatedId: 1
    },
    {
      id: 3,
      title: "Quart terminé",
      message: "Votre quart avec Luc Tremblay est terminé",
      date: new Date('2025-03-28T11:05:00').toISOString(),
      read: true,
      type: 'appointment',
      relatedId: 2
    },
    {
      id: 4,
      title: "Rappel système",
      message: "N'oubliez pas de mettre à jour votre disponibilité",
      date: new Date('2025-04-01T08:00:00').toISOString(),
      read: false,
      type: 'system'
    }
  ];

  // États
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const [reviews, setReviews] = useState<ReviewType[]>([
    {
      id: 1,
      appointmentId: 2,
      ratings: [4, 5, 4],
      comment: "Très professionnel, mais un peu en retard",
      date: "2025-03-28T12:30:00",
      patientName: "Luc Tremblay",
      procedure: "Consultation"
    }
  ]);

  // Fonction interne pour marquer les notifications comme lues
  const markNotificationAsReadForAppointment = (appointmentId: number) => {
    setNotifications(notifications.map(n => 
      n.type === 'appointment' && n.relatedId === appointmentId 
        ? { ...n, read: true } 
        : n
    ));
  };

  // Fonctions exposées dans le contexte
  const acceptOffer = (offerId: number) => {
    setOffers(offers.map(offer => {
      if (offer.id === offerId) {
        const newAppointment = {
          id: offer.id,
          date: offer.date,
          displayDate: new Date(offer.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          }),
          time: offer.time,
          patient: offer.patient,
          procedure: offer.title
        };
        setAppointments([...appointments, newAppointment]);

        addNotification({
          title: "Rendez-vous confirmé",
          message: `Votre ${offer.title} avec ${offer.patient} est confirmé`,
          type: 'appointment',
          relatedId: offer.id
        });

        return { ...offer, accepted: true };
      }
      return offer;
    }));
  };

  const cancelAppointment = (appointmentId: number) => {
    setOffers(offers.map(offer => 
      offer.id === appointmentId ? { ...offer, accepted: false } : offer
    ));
    setAppointments(appointments.filter(app => app.id !== appointmentId));

    addNotification({
      title: "Rendez-vous annulé",
      message: "Un rendez-vous a été annulé",
      type: 'appointment'
    });
  };

  const reloadOffers = () => {
    setOffers(initialOffers.map(offer => ({
      ...offer,
      accepted: false
    })));
  };

  const addNotification = (notification: Omit<NotificationType, 'id' | 'read' | 'date'>) => {
    // Vérifier si c'est une notification de type appointment
    if (notification.type === 'appointment' && notification.relatedId) {
      const appointment = appointments.find(a => a.id === notification.relatedId);
      const isPastAppointment = appointment && new Date(appointment.date) < new Date();
      
      // Si le quart n'est pas encore passé, on ne montre pas l'option de notation
      if (!isPastAppointment) {
        return;
      }
    }

    const newNotification = {
      ...notification,
      id: Date.now(),
      read: false,
      date: new Date().toISOString()
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addReview = (review: Omit<ReviewType, 'id' | 'date'>) => {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString()
    };
    setReviews([...reviews, newReview]);
    markNotificationAsReadForAppointment(review.appointmentId);
  };

  const getReviewsForAppointment = (appointmentId: number) => {
    return reviews.filter(review => review.appointmentId === appointmentId);
  };

  return (
    <AppContext.Provider value={{ 
      offers, 
      appointments,
      notifications,
      reviews,
      acceptOffer, 
      cancelAppointment,
      reloadOffers,
      addNotification,
      markNotificationAsRead,
      clearAllNotifications,
      addReview,
      getReviewsForAppointment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);