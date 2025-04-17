import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


let BASE_URL = "";

// Si on est sur le web (via un navigateur)
if (Platform.OS === "web") {
  const hostname = window?.location?.hostname;
  BASE_URL = hostname === "localhost"
    ? "http://localhost:4000/api/users"
    : `https://371b-142-137-176-156.ngrok-free.app/api/users`; // NGROK pour le web déployé
} else {
  // Sur mobile physique ou simulateur → on utilise ngrok aussi
  BASE_URL = "http://172.20.10.6:4000/api/users";
}

// Fonction générique pour les requêtes API
const fetchApi = async (endpoint, method, body = null) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erreur API");
    return data;
  } catch (error) {
    console.error(`Erreur ${method} ${endpoint}:`, error);
    throw error;
  }
};

// Fonction d'inscription
export const registerUser = (userData, type_utilisateur) => {
  if (type_utilisateur !== "professionnel" && type_utilisateur !== "clinique") {
    throw new Error("Type d'utilisateur invalide");
  }

  const dataToSend = {
    ...userData,
    type_utilisateur,
  };

  if (type_utilisateur === "clinique") {
    dataToSend.prenom = ""; // On met le prénom à vide pour les cliniques
  }

  return fetchApi("/register", "POST", dataToSend);
};

// Fonction de connexion
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Échec de la connexion");
    }

    return data; // Retourne le token et les données utilisateur
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

export const getProfileDetails = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("Token manquant. Veuillez vous reconnecter.");
  }

  // Étape 1 : Infos de base
  const userResponse = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const userData = await userResponse.json();
  if (!userResponse.ok) {
    throw new Error(userData.message || "Erreur lors de la récupération du profil utilisateur");
  }

  // Étape 2 : Infos spécifiques
  const id = userData.id_utilisateur;
  const type = userData.type_utilisateur;

  let typeUrl = "";
  if (type === "professionnel") {
    // 🔁 ADAPTÉ AU BACKEND : professionels (1 seul n)
    typeUrl = `http://172.20.10.6:4000/api/professionels/${id}`;
  } else if (type === "clinique") {
    typeUrl = `http://172.20.10.6:4000/api/cliniques/${id}`;
  } else {
    throw new Error("Type d'utilisateur inconnu");
  }

  const detailsResponse = await fetch(typeUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const detailsData = await detailsResponse.json();
  if (!detailsResponse.ok) {
    throw new Error(detailsData.message || "Erreur lors de la récupération du profil détaillé");
  }

  return { user: userData, details: detailsData };
};

