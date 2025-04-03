import React, { createContext, useState, useContext } from 'react';
import { Appointment, Offer } from './types';

type AppContextType = {
  offers: Offer[];
  appointments: Appointment[];
  acceptOffer: (offerId: number) => void;
  cancelAppointment: (appointmentId: number) => void;
};

const AppContext = createContext<AppContextType>({
  offers: [],
  appointments: [],
  acceptOffer: () => {},
  cancelAppointment: () => {},
});

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 1,
      title: "Détartrage complet",
      price: "135$",
      clinic: "Avenue Sourire",
      duration: "45 min",
      rating: "4.8",
      distance: "1.2 km",
      date: "2025-04-05",
      time: "09:00 - 10:30",
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
      time: "14:00 - 15:00",
      patient: "Marie Martin",
      accepted: false
    },
    {
      id: 3,
      title: "Consultation d'urgence",
      price: "76$",
      clinic: "Urgences Dentaires Montréal",
      duration: "30 min",
      rating: "4.2",
      distance: "0.8 km",
      date: "2025-04-10",
      time: "10:00 - 11:00",
      patient: "Mohamed Yasser",
      accepted: false
    }	,


    // ... autres offres
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
        id: 1,
        date: "2025-04-05",
        displayDate: "Samedi 5 avril 2025",
        time: "09:00 - 10:30",
        patient: "Jean Dupont",
        procedure: "Détartrage complet"
    },
    {
        id: 2,
        date: "Mardi 8 avril 2025", 
        time: "14:00 - 15:00",
        patient: "Marie Martin",
        procedure: "Consultation dentaire"
    },
    {
        id: 3,
        date: "Jeudi 18 Mars 2024",
        time: "10:30 - 11:30",
        patient: "Mohamed Yasser",
        procedure: "Pose d'implant"
    }
    // ... autres rendez-vous
  ]);

  const acceptOffer = (offerId: number) => {
    setOffers(offers.map(offer => {
      if (offer.id === offerId) {
        const newAppointment = {
          id: Date.now(),
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
        return { ...offer, accepted: true };
      }
      return offer;
    });
}

  const cancelAppointment = (appointmentId: number) => {
    setAppointments(appointments.filter(app => app.id !== appointmentId));
  };

  return (
    <AppContext.Provider value={{ offers, appointments, acceptOffer, cancelAppointment }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);