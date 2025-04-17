// lib/userApi.js
import { apiFetch } from './apiFetch';

// Récupérer le profil de l'utilisateur
export const fetchUserProfile = async () => {
  try {
    return await apiFetch('/users/profile');
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

// Mettre à jour le profil de l'utilisateur
export const updateUserProfile = async (profileData) => {
  try {
    return await apiFetch('/users/profile', {
      method: 'PUT',
      body: profileData
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

// Uploader une photo de profil
export const uploadUserPhoto = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    
    const response = await fetch(`${BASE_URL}/users/upload/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    throw error;
  }
};

// Uploader un document
export const uploadUserDocument = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    
    const response = await fetch(`${BASE_URL}/users/upload/document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Erreur lors de l\'upload du document:', error);
    throw error;
  }
};

// Télécharger un document
export const downloadUserDocument = async (documentType) => {
  try {
    const token = localStorage.getItem('token');
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    
    const response = await fetch(`${BASE_URL}/users/document/${documentType}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    throw error;
  }
};

// Convertir les données API vers le format du composant
export const transformApiDataToComponentFormat = (apiData) => {
  return {
    id: apiData.id_utilisateur,
    nom: apiData.nom,
    email: apiData.courriel,
    telephone: apiData.telephone || '',
    profession: apiData.type_profession || 'dentiste',
    description: apiData.description || '',
    photo: apiData.photo_profil || '',
    
    // Mobilité
    mobilite: {
      adressePrincipale: apiData.adresse_complete || apiData.adresse || '',
      rayon: apiData.rayon_deplacement_km || 0,
      vehicule: apiData.vehicule || false,
      regions: apiData.regions || []
    },
    
    // Disponibilité
    disponibilite: {
      debut: apiData.date_debut_dispo || '',
      fin: apiData.date_fin_dispo || '',
      disponibleImmediatement: apiData.disponibilite_immediate || false,
      jours: apiData.jours_disponibles || []
    },
    
    // Tarif
    tarifJournalier: apiData.tarif_horaire ? (apiData.tarif_horaire * 8) : 0,
    
    // Compétences et langues
    competences: apiData.competences || [],
    langues: apiData.langues || [],
    specialites: apiData.specialites || [],
    
    // Documents
    documents: apiData.documents || {},
    
    // Formations et expériences
    educations: apiData.formations || [],
    experiences: apiData.experiences || []
  };
};

// Convertir les données du composant vers le format API
export const transformComponentDataToApiFormat = (componentData) => {
  return {
    // Infos de base
    nom: componentData.nom,
    prenom: componentData.prenom || '',
    courriel: componentData.email,
    telephone: componentData.telephone,
    adresse: componentData.mobilite?.adressePrincipale || '',
    ville: componentData.ville || '',
    province: componentData.province || '',
    code_postal: componentData.code_postal || '',
    photo_profil: componentData.photo,
    
    // Infos professionnelles
    type_profession: componentData.profession,
    numero_permis: componentData.numero_permis || '',
    annees_experience: componentData.annees_experience || 0,
    
    // Tarif et mobilité
    tarif_horaire: componentData.tarifJournalier ? Math.round(componentData.tarifJournalier / 8) : 0,
    rayon_deplacement_km: componentData.mobilite?.rayon || 0,
    vehicule: componentData.mobilite?.vehicule || false,
    regions: componentData.mobilite?.regions || [],
    
    // Disponibilité
    disponibilite_immediate: componentData.disponibilite?.disponibleImmediatement || false,
    date_debut_dispo: componentData.disponibilite?.debut || null,
    date_fin_dispo: componentData.disponibilite?.fin || null,
    jours_disponibles: componentData.disponibilite?.jours || [],
    
    // Compétences et langues
    description: componentData.description || '',
    competences: componentData.competences || [],
    langues: componentData.langues || [],
    specialites: componentData.specialites || [],
    
    // Site web si présent
    site_web: componentData.site_web || ''
  };
};