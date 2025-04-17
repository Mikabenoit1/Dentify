export interface Offre {
  id: string;
  title: string;
  clinic: string;
  price: string;
  rating: string;
  distance: string;
  duration: string;
  date: string;
  time: string;
  patient: string;
  accepted: boolean;
}

const OffreStore = {
  offres: [] as Offre[],

  init: function() {
    this.offres = [
      {
        id: '1',
        title: "Détartrage complet",
        clinic: "Clinique Dentaire ABC",
        price: "120€",
        rating: "4.8",
        distance: "1.2km",
        duration: "45min",
        date: "2025-04-05", // Samedi 5 avril - Jean Dupont
        time: "09:00 - 10:00",
        patient: "Jean Dupont",
        accepted: false
      },
      {
        id: '2',
        title: "Blanchiment dentaire",
        clinic: "Centre Dentaire XYZ",
        price: "200€",
        rating: "4.5",
        distance: "2.3km",
        duration: "1h30",
        date: "2025-04-08", // Mardi 8 avril - Marie Martin
        time: "14:00 - 15:30",
        patient: "Marie Martin",
        accepted: false
      },
      {
        id: '3',
        title: "Consultation d'urgence",
        price: "76$",
        clinic: "Urgence dentaire Montreal", 
        duration: "30 min",
        rating: "4.2",
        distance: "0.8 km",
        date: "2025-04-04", // Vendredi 4 avril - Mohamed Yasser
        time: "10:30 - 11:00",
        patient: "Mohamed Yasser",
        accepted: false
      }
    ];
  },

  addOffre: function(offre: Offre) {
    const offreWithId = {
      ...offre,
      id: Date.now().toString()
    };
    this.offres.push(offreWithId);
    return offreWithId;
  },

  getOffres: function() {
    return [...this.offres];
  },

  supprimerOffre: function(id: string) {
    this.offres = this.offres.filter(offre => offre.id !== id);
  },

  accepterOffre: function(id: string) {
    this.offres = this.offres.map(offre => {
      if (offre.id === id) {
        return { ...offre, accepted: true };
      }
      return offre;
    });
  }
};

OffreStore.init();

export default OffreStore;