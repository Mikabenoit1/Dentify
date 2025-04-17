import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexte pour les offres et les rendez-vous
const OffersContext = createContext({
  offers: [],
  addOffer: () => {},
  updateOffer: () => {},
  deleteOffer: () => {},
  getOfferById: () => null,
  meetings: [],
  addMeeting: () => {},
  updateMeeting: () => {},
  deleteMeeting: () => {},
  getMeetingById: () => null,
  candidates: [],
  assignCandidate: () => {},
  getCandidatesForOffer: () => [],
  loading: false,
  error: null
});

// Fournisseur de contexte
export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les offres, les rendez-vous et les candidats depuis localStorage au montage
  useEffect(() => {
    const storedOffers = JSON.parse(localStorage.getItem('clinicOffers') || '[]');
    const storedMeetings = JSON.parse(localStorage.getItem('clinicMeetings') || '[]');
    const storedCandidates = JSON.parse(localStorage.getItem('clinicCandidates') || '[]');
    
    // Créer un exemple d'offre active avec Thomas Simard et candidats
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    // Exemple de candidats pour l'offre
    const exampleCandidates = [
      {
        id: 2001,
        offerId: 1001,
        name: "Thomas Simard",
        email: "thomas.simard@example.com",
        phone: "06 12 34 56 78",
        experience: "8 ans d'expérience en dentisterie générale",
        availability: "Disponible immédiatement",
        notes: "Actuellement en poste - Recommandé par Dr. Martin",
        status: "selected", // Candidat sélectionné
        applicationDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: 2002,
        offerId: 1001,
        name: "Sophie Dubois",
        email: "sophie.dubois@example.com",
        phone: "06 98 76 54 32",
        experience: "6 ans d'expérience, spécialisée en orthodontie",
        availability: "Disponible à partir du mois prochain",
        notes: "Très intéressée par le poste, références disponibles",
        status: "pending", // En attente de décision
        applicationDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: 2003,
        offerId: 1001,
        name: "Marc Lefevre",
        email: "marc.lefevre@example.com",
        phone: "06 55 44 33 22",
        experience: "10 ans d'expérience, spécialiste en implantologie",
        availability: "Disponible 3 jours par semaine",
        notes: "Cherche un poste à temps partiel, excellentes compétences techniques",
        status: "pending", // En attente de décision
        applicationDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];
    
    // Vérifier si les candidats exemples existent déjà
    if (storedCandidates.length === 0) {
      setCandidates(exampleCandidates);
      localStorage.setItem('clinicCandidates', JSON.stringify(exampleCandidates));
    } else {
      setCandidates(storedCandidates);
    }
    
    const thomasSimardOffer = {
      id: 1001,
      title: 'Remplacement dentiste - Poste pourvu par Thomas Simard',
      profession: 'dentiste',
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      description: 'Poste de remplacement actuellement occupé par Thomas Simard. Il s\'occupe des patients réguliers et des urgences.',
      requirements: 'Expérience confirmée en dentisterie générale.',
      compensation: '400€ par jour',
      datePosted: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      applications: 3,
      assignedCandidate: {
        id: 2001,
        name: "Thomas Simard"
      },
      location: "Paris, France",
      coordinates: {
        lat: 48.8566,
        lng: 2.3522
      },
      cliniqueName: "Cabinet Dentaire Saint-Michel",
      isSingleDay: false
    };
    
    // Vérifier si l'exemple existe déjà
    const exampleExists = storedOffers.some(offer => offer.id === 1001);
    
    if (!exampleExists) {
      // Ajouter l'exemple tout en conservant les offres existantes
      const updatedOffers = [thomasSimardOffer, ...storedOffers];
      setOffers(updatedOffers);
      localStorage.setItem('clinicOffers', JSON.stringify(updatedOffers));
    } else {
      // Mettre à jour l'exemple existant avec des dates actuelles
      const updatedOffers = storedOffers.map(offer => {
        if (offer.id === 1001) {
          return {
            ...thomasSimardOffer,
            status: 'active', // Forcer le statut actif
            assignedCandidate: {
              id: 2001,
              name: "Thomas Simard"
            }
          };
        }
        return offer;
      });
      setOffers(updatedOffers);
      localStorage.setItem('clinicOffers', JSON.stringify(updatedOffers));
    }
    
    setMeetings(storedMeetings);
  }, []);

  // Mettre à jour localStorage quand les offres changent
  useEffect(() => {
    localStorage.setItem('clinicOffers', JSON.stringify(offers));
  }, [offers]);
  
  // Mettre à jour localStorage quand les rendez-vous changent
  useEffect(() => {
    localStorage.setItem('clinicMeetings', JSON.stringify(meetings));
  }, [meetings]);
  
  // Mettre à jour localStorage quand les candidats changent
  useEffect(() => {
    localStorage.setItem('clinicCandidates', JSON.stringify(candidates));
  }, [candidates]);

  // Vérifier et mettre à jour les statuts des offres
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedOffers = offers.map(offer => {
      // Ne pas modifier automatiquement l'offre exemple
      if (offer.id === 1001) {
        return offer;
      }
      
      // Si la date de fin est antérieure à aujourd'hui, l'offre est expirée
      if (offer.endDate < today) {
        return { ...offer, status: 'expired' };
      }
      
      return offer;
    });
    
    // Mettre à jour les offres si des changements de statut ont été détectés
    if (JSON.stringify(updatedOffers) !== JSON.stringify(offers)) {
      setOffers(updatedOffers);
    }
  }, [offers]);

  // Fonction pour récupérer toutes les offres
  const fetchOffers = () => {
    try {
      setLoading(true);
      // Simuler un délai d'API
      setTimeout(() => {
        setOffers(JSON.parse(localStorage.getItem('clinicOffers') || '[]'));
        setLoading(false);
      }, 300);
    } catch (err) {
      setError("Erreur lors du chargement des offres");
      setLoading(false);
    }
  };

  // Fonction pour récupérer les offres à proximité
  const fetchNearbyOffers = (params) => {
    try {
      setLoading(true);
      // Simuler un délai d'API et filtrage géographique
      setTimeout(() => {
        const allOffers = JSON.parse(localStorage.getItem('clinicOffers') || '[]');
        // Dans une vraie implémentation, vous filtreriez basé sur la distance
        // Pour l'instant, on retourne simplement toutes les offres
        setOffers(allOffers);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError("Erreur lors du chargement des offres à proximité");
      setLoading(false);
    }
  };

  // Ajouter une nouvelle offre
  const addOffer = (newOffer) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Déterminer le statut initial en fonction des dates
    let initialStatus = 'pending';
    if (newOffer.endDate < today) {
      initialStatus = 'expired';
    }
    
    const offerWithDetails = {
      ...newOffer,
      id: newOffer.id || Date.now(),
      datePosted: newOffer.datePosted || today,
      status: initialStatus,
      applications: 0,
      isSingleDay: newOffer.startDate === newOffer.endDate,
      cliniqueName: newOffer.cliniqueName || "Cabinet Dentaire Saint-Michel"
    };
    
    setOffers(prevOffers => [offerWithDetails, ...prevOffers]);
    return offerWithDetails;
  };

  // Mettre à jour une offre existante
  const updateOffer = (updatedOffer) => {
    const today = new Date().toISOString().split('T')[0];
    
    let statusToSet = updatedOffer.status;
    
    // Ne pas modifier automatiquement le statut de l'offre exemple
    if (updatedOffer.id !== 1001) {
      // Vérifier si l'offre doit être marquée comme expirée
      if (updatedOffer.endDate < today) {
        statusToSet = 'expired';
      }
    }
    
    // Mettre à jour le champ isSingleDay
    const finalOffer = {
      ...updatedOffer,
      status: statusToSet,
      isSingleDay: updatedOffer.startDate === updatedOffer.endDate
    };
    
    setOffers(prevOffers => 
      prevOffers.map(offer => 
        offer.id === updatedOffer.id ? finalOffer : offer
      )
    );
    
    return finalOffer;
  };

  // Supprimer une offre
  const deleteOffer = (offerId) => {
    setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
    // Supprimer également les candidats associés
    setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate.offerId !== offerId));
    return true;
  };

  // Récupérer une offre par son ID
  const getOfferById = (offerId) => {
    return offers.find(offer => offer.id === offerId);
  };
  
  // Obtenir les candidats pour une offre spécifique
  const getCandidatesForOffer = (offerId) => {
    return candidates.filter(candidate => candidate.offerId === offerId);
  };
  
  // Assigner un candidat à une offre
  const assignCandidate = (offerId, candidateId) => {
    // Trouver le candidat
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) return false;
    
    // Mettre à jour le statut du candidat sélectionné et réinitialiser les autres
    setCandidates(prevCandidates => 
      prevCandidates.map(c => {
        if (c.offerId === offerId) {
          // Si c'est le candidat sélectionné
          if (c.id === candidateId) {
            return { ...c, status: 'selected' };
          } else {
            // Tous les autres candidats pour cette offre passent en 'pending'
            return { ...c, status: 'pending' };
          }
        }
        return c;
      })
    );
    
    return true;
  };
  
  // Ajouter un nouveau rendez-vous
  const addMeeting = (meeting) => {
    const newMeeting = {
      ...meeting,
      id: Date.now(), // Générer un ID unique
      createdAt: new Date().toISOString()
    };
    setMeetings(prevMeetings => [newMeeting, ...prevMeetings]);
    return newMeeting;
  };
  
  // Mettre à jour un rendez-vous existant
  const updateMeeting = (updatedMeeting) => {
    setMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      )
    );
    return updatedMeeting;
  };
  
  // Supprimer un rendez-vous
  const deleteMeeting = (meetingId) => {
    setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== meetingId));
    return true;
  };
  
  // Récupérer un rendez-vous par son ID
  const getMeetingById = (meetingId) => {
    return meetings.find(meeting => meeting.id === meetingId);
  };

  return (
    <OffersContext.Provider 
      value={{ 
        offers, 
        loading,
        error,
        fetchOffers,
        fetchNearbyOffers,
        addOffer, 
        updateOffer, 
        deleteOffer, 
        getOfferById,
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        getMeetingById,
        candidates,
        getCandidatesForOffer,
        assignCandidate
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte des offres
export const useOffers = () => useContext(OffersContext);