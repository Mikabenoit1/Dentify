// lib/messageApi.js
import { apiFetch } from './apiFetch';

// ✅ Récupérer toutes les conversations (pour clinique ou professionnel)
export const fetchConversations = async () => {
  try {
    const response = await apiFetch('/messages/conversations');
    console.log("📨 Conversations reçues:", response);
    return response;
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    return [];
  }
};

export const fetchMessagesByConversation = async (candidatId, offreId) => {
  if (!candidatId) {
    console.error("❌ candidatId est requis");
    return [];
  }

  try {
    console.log("🔄 Chargement des messages pour la conversation:", { candidatId, offreId });

    // Construire l'URL en fonction de la présence de offreId
    const url = offreId 
      ? `/messages/${candidatId}/offre/${offreId}`
      : `/messages/${candidatId}`;

    const response = await apiFetch(url);
    console.log("📨 Réponse API messages:", response);

    if (!Array.isArray(response)) {
      console.warn("⚠️ La réponse n'est pas un tableau:", response);
      return [];
    }

    // Transformation des messages
    const transformedMessages = response.map(msg => ({
      id_message: msg.id_message,
      contenu: msg.contenu,
      date_envoi: msg.date_envoi,
      expediteur_id: msg.expediteur_id,
      destinataire_id: msg.destinataire_id,
      est_lu: msg.est_lu,
      type_message: msg.type_message || 'normal',
      expediteur: msg.expediteur,
      destinataire: msg.destinataire,
      id_conversation: msg.id_conversation,
      offre_id: msg.offre_id
    }));

    console.log("Messages transformés:", transformedMessages);
    return transformedMessages;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des messages:", error);
    return [];
  }
};

export const sendMessage = async ({ contenu, offre_id, destinataire_id, type_message = 'normal', expediteur_id, id_conversation }) => {
  console.log("📦 sendMessage - Données à envoyer:", {
    contenu,
    offre_id,
    destinataire_id,
    type_message,
    expediteur_id,
    id_conversation
  });

  if (!contenu || !destinataire_id) {
    console.error("❌ Paramètres requis manquants:", { contenu, destinataire_id });
    throw new Error("Le contenu et l'ID du destinataire sont requis");
  }

  try {
    const messageData = {
      contenu: contenu.trim(),
      id_offre: offre_id ? parseInt(offre_id) : null,
      destinataire_id: parseInt(destinataire_id),
      expediteur_id: parseInt(expediteur_id),
      type_message,
      id_conversation,
      est_lu: false
    };

    console.log("📤 Données formatées:", messageData);

    const response = await apiFetch('/messages', {
      method: 'POST',
      body: messageData
    });

    console.log("✅ Message envoyé:", response);
    return response;
  } catch (error) {
    console.error("❌ Erreur d'envoi:", error);
    throw error;
  }
};

// ✅ Supprimer un message
export const deleteMessage = async (messageId) => {
  try {
    await apiFetch(`/messages/${messageId}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error("❌ Erreur de suppression:", error);
    throw error;
  }
};

// ✅ Marquer un message comme lu
export const markAsRead = async (messageId) => {
  try {
    await apiFetch(`/messages/lu/${messageId}`, {
      method: 'PUT'
    });
    return true;
  } catch (error) {
    console.error("❌ Erreur de marquage comme lu:", error);
    throw error;
  }
};

// ✅ Modifier un message existant
export const updateMessage = async (messageId, newContent) => {
  try {
    const response = await apiFetch(`/messages/${messageId}`, {
      method: 'PUT',
      body: { contenu: newContent }
    });
    return response;
  } catch (error) {
    console.error("❌ Erreur de mise à jour:", error);
    throw error;
  }
};
