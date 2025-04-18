// src/lib/clinicApi.js
import { apiFetch, API_BASE_URL } from './apiFetch';

// Transformer les données API vers le format du composant MaClinique
export const transformApiToComponentFormat = (apiData) => {
  const BASE_URL = API_BASE_URL.replace('/api', '');
  
  return {
    nom: apiData.nom_clinique || apiData.nom || '',
    adresse: apiData.adresse_complete || apiData.adresse || '',
    ville: apiData.ville || '',
    codePostal: apiData.code_postal || '',
    telephone: apiData.telephone || '',
    email: apiData.courriel || apiData.email || '',
    siteWeb: apiData.site_web || '',
    description: apiData.description || '',
    specialites: apiData.specialites || [],
    services: apiData.services || [],
    equipement: apiData.equipement || [],
    equipe: apiData.equipe || [],
    logo: apiData.logo ? `${BASE_URL}${apiData.logo}` : '',
    photos: apiData.photos || [],
    horaires: apiData.horaires || {
      lundi: { ouvert: true, debut: '09:00', fin: '17:00' },
      mardi: { ouvert: true, debut: '09:00', fin: '17:00' },
      mercredi: { ouvert: true, debut: '09:00', fin: '17:00' },
      jeudi: { ouvert: true, debut: '09:00', fin: '17:00' },
      vendredi: { ouvert: true, debut: '09:00', fin: '17:00' },
      samedi: { ouvert: false, debut: '09:00', fin: '17:00' },
      dimanche: { ouvert: false, debut: '09:00', fin: '17:00' }
    }
  };
};

// 🔹 Récupérer le profil de la clinique
export const fetchClinicProfile = async () => {
  try {
    // D'abord, essayons juste de récupérer le profil utilisateur qui devrait exister
    const userData = await apiFetch('/users/profile');
    
    // Initialiser un profil de base avec les données utilisateur
    let clinicData = transformApiToComponentFormat(userData);
    
    try {
      // Ensuite, essayons de récupérer le profil clinique (qui pourrait ne pas exister encore)
      const cliniqueData = await apiFetch('/cliniques/profile');
      if (cliniqueData) {
        // Si on a des données de clinique, on les fusionne avec les données utilisateur
        clinicData = transformApiToComponentFormat({...userData, ...cliniqueData});
      }
    } catch (clinicError) {
      console.warn("Profil clinique non trouvé ou non créé, utilisation des données utilisateur uniquement");
      // Si cette requête échoue, on continue avec juste les données utilisateur
    }
    
    return clinicData;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil de la clinique:", error);
    throw error;
  }
};

// 🔹 Mettre à jour le profil de la clinique
export const updateClinicProfile = async (data) => {
  try {
    // Mettre à jour les données utilisateur (email, etc.)
    await apiFetch('/users/profile', {
      method: 'PUT',
      body: {
        nom: data.nom,
        adresse: data.adresse,
        ville: data.ville,
        code_postal: data.codePostal,
        courriel: data.email
      }
    });
    
    // Préparer les données pour la clinique
    const clinicData = {
      nom: data.nom,
      adresse: data.adresse,
      ville: data.ville,
      codePostal: data.codePostal,
      telephone: data.telephone,
      email: data.email,
      siteWeb: data.siteWeb,
      description: data.description,
      specialites: data.specialites || [],
      services: data.services || [],
      equipement: data.equipement || [],
      equipe: data.equipe || [],
      horaires: data.horaires,
      logo: data.logo,
      photos: data.photos || []
    };
    
    // Mettre à jour les données spécifiques à la clinique
    return await apiFetch('/cliniques/profile', {
      method: 'PUT',
      body: clinicData
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil de la clinique:", error);
    throw error;
  }
};

// 🔹 Uploader le logo
export const uploadClinicLogo = async (formData) => {
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const response = await fetch(`${BASE_URL}/cliniques/upload/logo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'upload du logo");
  }

  return response.json();
};

// 🔹 Uploader une photo
export const uploadClinicPhoto = async (formData) => {
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const response = await fetch(`${BASE_URL}/cliniques/upload/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'upload de la photo");
  }

  return response.json();
};