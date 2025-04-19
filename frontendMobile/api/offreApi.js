import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// === BASE URLS ===
let BASE_URL_OFFRES = "";
let BASE_URL_CANDIDATURES = "";

if (Platform.OS === "web") {
  const hostname = window?.location?.hostname;
  BASE_URL_OFFRES = hostname === "localhost"
    ? "http://localhost:4000/api/offres"
    : "https://371b-142-137-176-156.ngrok-free.app/api/offres";
  BASE_URL_CANDIDATURES = hostname === "localhost"
    ? "http://localhost:4000/api/candidatures"
    : "https://371b-142-137-176-156.ngrok-free.app/api/candidatures";
} else {
  BASE_URL_OFFRES = "http://172.16.8.102:4000/api/offres";
  BASE_URL_CANDIDATURES = "http://172.16.8.102:4000/api/candidatures";
}

// === FONCTION GÉNÉRIQUE POUR LES OFFRES ===
const fetchOffreApi = async (endpoint, method, body = null) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${BASE_URL_OFFRES}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erreur API Offre");
    return data;
  } catch (error) {
    console.error(`Erreur ${method} ${endpoint}:`, error);
    throw error;
  }
};

// === OFFRES ===
export const publierOffre = async (offreData) => {
  return await fetchOffreApi("/creer", "POST", offreData);
};

export const getMesOffres = async () => {
  return await fetchOffreApi("/mes-offres", "GET");
};

export const supprimerOffre = async (id) => {
  return await fetchOffreApi(`/${id}`, "DELETE");
};

export const archiverOffre = async (id) => {
  return await fetchOffreApi(`/${id}/archive`, "PATCH");
};

export const getOffresDisponibles = async () => {
  return await fetchOffreApi("/", "GET");
};

// === CANDIDATURES ===
export const accepterOffre = async (id_offre) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${BASE_URL_CANDIDATURES}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({
      id_offre,
      statut: "acceptee", // On force les bons champs
      est_confirmee: "Y",
      message_personnalise: "J'accepte cette offre"
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erreur acceptation offre");
  return data;
};

export const getCandidaturesPro = async () => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${BASE_URL_CANDIDATURES}/mes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  const raw = await response.text();  // on lit d'abord brut
  console.log("RAW RESPONSE:", raw);  // voir si c’est du HTML ou JSON

  try {
    const data = JSON.parse(raw);
    if (!response.ok) throw new Error(data.message || "Erreur récupération candidatures");
    return data;
  } catch (e) {
    console.error("❌ Erreur de parsing JSON :", e);
    throw new Error("Réponse invalide du serveur (probablement HTML)");
  }
};

export const annulerCandidature = async (id_offre) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${BASE_URL_CANDIDATURES}/offre/${id_offre}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erreur annulation candidature");
  return data;
};

export const getHorairePro = async () => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${BASE_URL_CANDIDATURES}/horaire`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  const raw = await response.text();

  try {
    const data = JSON.parse(raw);
    if (!response.ok) throw new Error(data.message || "Erreur API horaire");
    return data;
  } catch (e) {
    console.error("❌ Erreur parsing JSON /horaire :", e);
    console.error("↩️ RAW :", raw);
    throw new Error("Erreur serveur ou réponse invalide");
  }
};





