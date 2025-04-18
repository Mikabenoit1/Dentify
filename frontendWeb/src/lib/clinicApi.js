// src/lib/clinicApi.js
import { apiFetch, API_BASE_URL, FILE_BASE_URL } from './apiFetch';

// 🔁 Transformer les données API vers le format du composant MaClinique
export const transformApiToComponentFormat = (apiData) => {
  // Fonction auxiliaire pour construire l'URL complète si nécessaire
  const getFullUrl = (path) => {
    if (!path) return '';
    // Éviter la duplication de FILE_BASE_URL
    return path.startsWith('http') || path.startsWith(FILE_BASE_URL) ? path : `${FILE_BASE_URL}${path}`;
  };

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
    logo: getFullUrl(apiData.logo),
    photos: Array.isArray(apiData.photos)
      ? apiData.photos.map(p => getFullUrl(p))
      : [],
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
    const userData = await apiFetch('/users/profile');
    let clinicData = transformApiToComponentFormat(userData);

    try {
      const cliniqueData = await apiFetch('/cliniques/profile');
      if (cliniqueData) {
        clinicData = transformApiToComponentFormat({ ...userData, ...cliniqueData });
      }
    } catch {
      console.warn("⚠️ Profil clinique non trouvé, utilisation des données utilisateur uniquement");
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

    // Nettoyage des URLs pour les photos
    const cleanPhotos = Array.isArray(data.photos) 
      ? data.photos.map(photo => {
          return photo.startsWith(FILE_BASE_URL) ? photo.replace(FILE_BASE_URL, '') : photo;
        })
      : [];

    console.log("Photos nettoyées avant envoi:", cleanPhotos);

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
      photos: cleanPhotos
    };

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
  const response = await fetch(`${API_BASE_URL}/cliniques/upload/logo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'upload du logo");
  }

  return response.json(); // { logoUrl: "/uploads/logos/..." }
};

// 🔹 Uploader une photo
export const uploadClinicPhoto = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/cliniques/upload/photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'upload de la photo");
  }

  return response.json(); // { photoUrl: "/uploads/logos/..." }
};
