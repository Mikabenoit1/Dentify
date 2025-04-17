

// Store pour gérer les offres
const OffreStore = {
    // Tableau pour stocker les offres
    offres: [],
    
    // pour ajouter une offre
    addOffre: function(offre) {
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

    supprimerOffre: function(id) {
        this.offres = this.offres.filter(offre => offre.id !== id);
    }
  };
  
  export default OffreStore;