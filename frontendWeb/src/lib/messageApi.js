// lib/messageApi.js
import { apiFetch } from './apiFetch';

// ✅ Récupérer toutes les conversations (pour clinique ou professionnel)
export const fetchConversations = async () => {
  return await apiFetch('/messages/conversations');
};

// ✅ Récupérer les messages d'une conversation spécifique
export const fetchMessagesByConversation = async (conversationId) => {
  return await apiFetch(`/messages/conversations/${conversationId}`);
};

// ✅ Envoyer un nouveau message
export const sendMessage = async (data) => {
  return await apiFetch('/messages', {
    method: 'POST',
    body: data
  });
};

// ✅ Supprimer un message
export const deleteMessage = async (id) => {
  return await apiFetch(`/messages/${id}`, {
    method: 'DELETE'
  });
};

// ✅ Marquer un message comme lu
export const markAsRead = async (id) => {
  return await apiFetch(`/messages/${id}/read`, {
    method: 'PUT'
  });
};

// ✅ Modifier un message existant
export const updateMessage = async (id, contenu) => {
  return await apiFetch(`/messages/${id}`, {
    method: 'PUT',
    body: { contenu }
  });
};
