import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let BASE_URL = '';
if (Platform.OS === 'web') {
  const hostname = window?.location?.hostname;
  BASE_URL = hostname === 'localhost'
    ? 'http://localhost:4000/api/messages'
    : 'https://371b-142-137-176-156.ngrok-free.app/api/messages';
} else {
  BASE_URL = 'http://192.168.1.190:4000/api/messages';
}

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Token manquant');
  return token;
};

const fetchWithAuth = async (endpoint, method = 'GET', body = null) => {
  const token = await getToken();
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await res.text();

    console.log(`🪵 [${method}] ${BASE_URL}${endpoint}`);
    console.log('📨 Réponse brute:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`❌ Réponse non-JSON : ${text}`);
    }

    if (!res.ok) throw new Error(data.message || 'Erreur API');
    return data;
  } catch (error) {
    console.error(`❗Erreur [${method}] ${endpoint}:`, error.message);
    throw error;
  }
};

//  Récupérer les conversations
export const getConversations = () => fetchWithAuth('/conversations');

//  Liste des conversations enrichies
export const getConversationsDetails = () => fetchWithAuth('/conversations/details');

//  Récupérer les messages d’une conversation spécifique
export const getMessagesForConversation = (id_conversation) =>
  fetchWithAuth(`/conversations/${id_conversation}/messages`);

//  Récupérer les messages avec un utilisateur pour une offre
export const getMessagesWithUserForOffer = (id_utilisateur, id_offre) =>
  fetchWithAuth(`/${id_utilisateur}/offre/${id_offre}`);

//  Envoyer un message
export const sendMessage = (messageData) =>
  fetchWithAuth('/', 'POST', messageData);

//  Supprimer un message
export const deleteMessage = (id) =>
  fetchWithAuth(`/${id}`, 'DELETE');

// ✏️ Modifier un message
export const updateMessage = (id, contenu) =>
  fetchWithAuth(`/${id}`, 'PUT', { contenu });

//  Obtenir tous les utilisateurs
export const getAllUsers = async () => {
  const token = await getToken();
  const usersBaseUrl = BASE_URL.replace('/messages', '/users');

  const response = await fetch(`${usersBaseUrl}/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });

  const text = await response.text();
  console.log(' Utilisateurs - Réponse brute :', text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Réponse invalide pour /users/all : ${text}`);
  }

  if (!response.ok) throw new Error(data.message || 'Erreur API utilisateurs');
  return data;
};

