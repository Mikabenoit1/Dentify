// lib/messageApi.js
import { apiFetch } from './apiFetch';

// ✅ Récupérer toutes les conversations (pour clinique ou professionnel)
export const fetchConversations = async () => {
  return await apiFetch('/messages/conversations');
};

// ✅ Récupérer les messages d'une conversation spécifique
export const fetchMessagesByConversation = async (candidatId, offreId) => {
  return await apiFetch(`/messages/${candidatId}/offre/${offreId}`);
};


export const sendMessage = async ({ contenu, offre_id, destinataire_id, expediteur_id }) => {
  return await apiFetch('/messages', {
    method: 'POST',
    body: {
      contenu,
      offre_id,
      destinataire_id,
      expediteur_id
    }
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
