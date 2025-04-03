export interface Offre {
  id: string; // Obligatoire
  titre: string;
  profession: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  description: string;
  exigences: string;
  remuneration: string;
}
// Store pour gérer les offres
const OffreStore = {
  // Tableau pour stocker les offres
  offres: [] as Offre[], // Typage du tableau

  // pour ajouter une offre
  addOffre: function(offre: Offre) { // Typage explicite du paramètre
    // Ajouter un ID unique
    const offreWithId = { 
      ...offre, 
      id: Date.now().toString() 
    };

    // ajoute l'offre au tableau 
    this.offres.push(offreWithId);

    return offreWithId;
  },

  // pour récup tout les offres
  getOffres: function() {
    return [...this.offres];
  },

  supprimerOffre: function(id: string) { // Typage explicite du paramètre id
    this.offres = this.offres.filter(offre => offre.id !== id);
  }
};

export default OffreStore;