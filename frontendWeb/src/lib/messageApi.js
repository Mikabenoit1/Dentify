// lib/messageApi.js
import { apiFetch } from './apiFetch';

// ✅ Récupérer toutes les conversations (pour clinique ou professionnel)
export const fetchConversations = async () => {
  return await apiFetch('/messages/conversations');
};

export const fetchMessagesByConversation = async (destinataireId, offreId) => {
  if (!destinataireId) {
    console.error("❌ destinataireId is required");
    return [];
  }

  try {
    // Parse IDs as integers
    const parsedDestId = parseInt(destinataireId, 10);
    const parsedOffreId = parseInt(offreId, 10);

    console.log("🔄 Fetching messages with params:", {
      destinataireId: parsedDestId,
      offreId: parsedOffreId
    });

    // Construct the endpoint based on whether we have an offreId
    const endpoint = `/messages/${parsedDestId}/offre/${parsedOffreId}`;
    console.log("📤 Calling API endpoint:", endpoint);

    const response = await apiFetch(endpoint);
    console.log("📨 Messages response:", response);

    if (!Array.isArray(response)) {
      console.warn("⚠️ Response is not an array:", response);
      return [];
    }

    return response;
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return [];
  }
};


export const sendMessage = async ({ contenu, offre_id, destinataire_id, type_message = 'normal' }) => {
  console.log("📦 sendMessage - Données envoyées à l'API :", {
    contenu,
    offre_id,
    destinataire_id,
    type_message
  });

  if (!contenu || !destinataire_id) {
    console.error("❌ Paramètres requis manquants:", { contenu, destinataire_id });
    throw new Error("Les paramètres contenu et destinataire_id sont requis");
  }

  try {
    const response = await apiFetch('/messages', {
      method: 'POST',
      body: {
        contenu: contenu.trim(),
        offre_id,
        destinataire_id,
        type_message,
        est_lu: 'N'
      }
    });

    console.log("✅ Message envoyé avec succès:", response);
    return response;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message:", error);
    throw error;
  }
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
