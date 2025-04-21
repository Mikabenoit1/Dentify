import { apiFetch } from './apiFetch';

export const postulerOffre = async (offerId) => {
    try {
      return await apiFetch('/candidatures', {
        method: 'POST',
        body: { id_offre: offerId }
      });
    } catch (error) {
      console.error("Erreur lors de la candidature :", error);
      throw error;
    }
  };
  
  export const retirerCandidature = async (candidatureId) => {
    try {
      return await apiFetch(`/candidatures/${candidatureId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Erreur lors du retrait de la candidature :", error);
      throw error;
    }
  };
  
  export const fetchCandidatures = async () => {
    try {
      return await apiFetch('/candidatures');
    } catch (error) {
      console.error("Erreur lors du chargement des candidatures :", error);
      throw error;
    }
  };

  export const fetchUserCandidatures = async () => {
    return await apiFetch('/candidatures/moi');
  };

  export const postulerAOffre = async (offreId) => {
    try {
      const response = await apiFetch(`/offres/postuler/${offreId}`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  export const retirerCandidatureAPI = async (id) => {
    try {
      return await apiFetch(`/offres/candidatures/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  };
  
  export const fetchCandidaturesByOffre = async (offreId) => {
    try {
      const response = await apiFetch(`/offres/${offreId}/candidatures`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération des candidatures pour l'offre ${offreId}:`, error);
      throw error;
    }
  };
  
  export const accepterCandidature = async (candidatureId) => {
    try {
      const response = await apiFetch(`/offres/accepter/${candidatureId}`, {
        method: 'PUT'
      });
      return response;
    } catch (error) {
      console.error(`Erreur lors de l'acceptation de la candidature:`, error);
      throw error;
    }
  };
  
  export const refuserCandidature = async (candidatureId, motif) => {
    try {
      const response = await apiFetch(`/offres/refuser/${candidatureId}`, {
        method: 'PUT',
        body: {
          message_reponse: motif || undefined
        }
      });
      return response;
    } catch (error) {
      console.error(`Erreur lors du refus de la candidature:`, error);
      throw error;
    }
  };