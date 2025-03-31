// Types pour les offres
interface Offre {
    titre: string;
    description: string;
    profession: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    exigences: string;
    remuneration: string;
    id?: string;
  }
  
  // Store pour gérer les offres
  const OffreStore = {
    // Tableau pour stocker les offres
    offres: [] as Offre[],
    
    // pour ajouter une offre
    addOffre: function(offre: Offre): Offre {
      // Ajouter un ID unique
      const offreWithId: Offre = {
        ...offre,
        id: Date.now().toString()
      };
      // ajoute l'offre au tableau
      this.offres.push(offreWithId);
      return offreWithId;
    },
    
    // pour récup tout les offres
    getOffres: function(): Offre[] {
      return [...this.offres];
    },
    
    supprimerOffre: function(id: string): void {
      this.offres = this.offres.filter(offre => offre.id !== id);
    }
  };
  
  export default OffreStore;
