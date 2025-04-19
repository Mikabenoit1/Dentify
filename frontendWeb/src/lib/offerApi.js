import { apiFetch } from './apiFetch';

export const fetchOfferById = async (offerId) => {
    try {
      return await apiFetch(`/offres/${offerId}`);
    } catch (error) {
      console.error("Erreur lors du chargement de l'offre :", error);
      throw error;
    }
  };
  
// 🔹 Créer une nouvelle offre
export const createOffer = async (offerData) => {
  try {
    return await apiFetch('/offres/creer', {
      method: 'POST',
      body: offerData
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'offre:", error);
    throw error;
  }
};

// 🔹 Modifier une offre existante (optionnel)
export const updateOffer = async (offerId, offerData) => {
  try {
    return await apiFetch(`/offres/${offerId}`, {
      method: 'PUT',
      body: offerData
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'offre:", error);
    throw error;
  }
};

// 🔹 Archiver une offre
export const archiveOffer = async (offerId) => {
  try {
    return await apiFetch(`/offres/${offerId}/archive`, {
      method: 'PATCH'
    });
  } catch (error) {
    console.error("Erreur lors de l'archivage de l'offre:", error);
    throw error;
  }
};

export const deleteOffer = async (offerId) => {
    try {
      return await apiFetch(`/offres/${offerId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre:', error);
      throw error;
    }
  };

  export const fetchOffersForClinic = async () => {
    return await apiFetch('/offres/mes-offres'); // ou '/offres/creer' si c’est le bon endpoint
  };
  
  export const fetchNearbyOffersAPI = async (coordinates, rayon) => {
    return await apiFetch(`/offres/proches?lat=${coordinates.lat}&lng=${coordinates.lng}&rayon=${rayon}`);
  };
  