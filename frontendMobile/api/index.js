import { Platform } from 'react-native';

let BASE_URL = "";

// Web : utilise l'adresse de la page actuelle
if (Platform.OS === "web") {
  const hostname = window?.location?.hostname;
  BASE_URL = hostname === "localhost"
    ? "http://localhost:4000/api/users"
    : `http://192.168.1.190:4000/api/users`;
} else {
  // Mobile : IP locale du serveur backend (à adapter si besoin)
  BASE_URL = "http://192.168.1.190:4000/api/users";
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

// Fonction générique d'inscription qui s'adapte selon le type d'utilisateur
export const registerUser = (userData, type_utilisateur) => {
  // Vérifie que type_utilisateur est valide (professionnel ou clinique)
  if (type_utilisateur !== "professionnel" && type_utilisateur !== "clinique") {
    throw new Error("Type d'utilisateur invalide");
  }

  // On prépare les données en fonction du type d'utilisateur
  const dataToSend = {
    ...userData,
    type_utilisateur,
  };

  // Si c'est une clinique, on peut ajouter des champs spécifiques
  if (type_utilisateur === "clinique") {
    dataToSend.prenom = ""; // On met le prénom à vide pour les cliniques
  }

  return fetchApi("/register", "POST", dataToSend);
};

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
