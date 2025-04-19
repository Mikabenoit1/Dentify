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
  // Sur mobile physique ou simulateur
  BASE_URL = "http://172.16.8.102:4000/api/users";
}

// Fonction générique
const fetchApi = async (endpoint, method, body = null) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
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

export const registerUser = (userData, type_utilisateur) => {
  const dataToSend = { ...userData, type_utilisateur };
  if (type_utilisateur === "clinique") dataToSend.prenom = "";
  return fetchApi("/register", "POST", dataToSend);
};

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Échec de la connexion");

  await AsyncStorage.setItem("token", data.token);
  return data;
};

export const getProfileDetails = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Token manquant. Veuillez vous reconnecter.");

  const userResponse = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const userData = await userResponse.json();
  if (!userResponse.ok) throw new Error(userData.message || "Erreur lors de la récupération du profil utilisateur");

  return { user: userData };
};

export const updateProfile = async (profileData) => {
  return await fetchApi("/profile", "PUT", profileData);
};
