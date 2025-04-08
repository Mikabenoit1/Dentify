// 1. Configuration de base
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// 2. Fonction générique pour les requêtes
export const apiFetch = async (endpoint, { method = 'GET', body = null, headers = {} } = {}) => {
  // Gestion du token JWT (si existant)
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Ajout conditionnel
    ...headers
  };

  // 3. Envoi de la requête
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : null,
  });

  // 4. Gestion des erreurs HTTP
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
  }

  // 5. Retour des données (pour les réponses non vides)
  return response.status !== 204 ? response.json() : null;
};

// 6. Exemples de méthodes spécifiques (optionnel)
export const registerUser = (userData) => apiFetch('/users/register', { method: 'POST', body: userData });
export const loginUser = (credentials) => apiFetch('/users/login', { method: 'POST', body: credentials });

// Fonctions spécifiques pour les cliniques
export const getClinique = (id) => apiFetch(`/${id}`);
export const updateClinique = (id, data) => apiFetch(`/${id}`, { method: 'PUT', body: data });