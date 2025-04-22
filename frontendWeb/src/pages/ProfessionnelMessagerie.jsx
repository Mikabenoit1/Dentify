import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchConversations,
  fetchMessagesByConversation,
  sendMessage,
  deleteMessage
} from '../lib/messageApi';
import { fetchUserProfile } from '../lib/userApi';
import '../styles/ProfessionnelMessagerie.css';

function ProfessionnelMessagerie() {
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageActionsOpen, setMessageActionsOpen] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newMessageMode, setNewMessageMode] = useState(false);

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || { messages: [] };

  // Charger le profil du professionnel connecté
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await fetchUserProfile(); // 👈 pour le professionnel
        setCurrentUserId(profile.id_utilisateur || profile.id);
      } catch (err) {
        console.error("Erreur lors du chargement du profil professionnel :", err);
      }
    };
    loadCurrentUser();
  }, []);

  // Charger les conversations du professionnel connecté
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const conversationsData = await fetchConversations();
        console.log("📨 Conversations brutes :", conversationsData);

        // Transform the conversations data
        const transformedConversations = [];
        
        // Only process if we have valid data
        if (Array.isArray(conversationsData) && conversationsData.length > 0) {
          for (const conv of conversationsData) {
            // Skip if essential data is missing
            if (!conv.id_utilisateur) {
              console.warn("⚠️ Skipping conversation without id_utilisateur:", conv);
              continue;
            }

            // Create a valid conversation object
            const conversation = {
              id: `${conv.id_utilisateur}`, // Use just the user ID as the conversation ID
              cliniqueId: conv.id_utilisateur, // For professionals, this is the clinic's ID
              offreId: 20, // Hardcode to 20 for now since that's the offer ID we're using
              cliniqueName: `${conv.prenom} ${conv.nom}`.trim() || 'Clinique',
              offerTitle: 'Nouvelle discussion',
              lastMessage: '',
              lastMessageDate: new Date().toISOString(),
              unread: false,
              messages: []
            };

            transformedConversations.push(conversation);
          }
        }

        console.log("📨 Conversations transformées :", transformedConversations);
        setConversations(transformedConversations);

        // Set active conversation if we have a conversationId or default to first conversation
        if (conversationId) {
          setActiveConversationId(conversationId);
        } else if (transformedConversations.length > 0) {
          setActiveConversationId(transformedConversations[0].id);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des conversations :", err);
        setNotification({
          show: true,
          message: "Erreur lors du chargement des conversations",
          type: 'error'
        });
      }
    };

    loadConversations();
  }, [conversationId]);

  // Charger les messages liés à la conversation active
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId || !currentUserId) {
        console.log("⏳ En attente de l'ID de conversation et de l'utilisateur");
        return;
      }

      const conv = conversations.find(c => c.id === activeConversationId);
      if (!conv) {
        console.log("❌ Conversation non trouvée:", activeConversationId);
        return;
      }

      try {
        console.log("🔄 Chargement des messages pour:", {
          currentUserId,
          offreId: conv.offreId
        });
        
        const messages = await fetchMessagesByConversation(currentUserId, conv.offreId);
        console.log("📨 Messages reçus:", messages);

        if (Array.isArray(messages)) {
          setConversations(prev =>
            prev.map(c =>
              c.id === activeConversationId
                ? {
                    ...c,
                    messages,
                    lastMessage: messages.length > 0 ? messages[messages.length - 1].contenu : '',
                    lastMessageDate: messages.length > 0 ? messages[messages.length - 1].date_envoi : new Date().toISOString()
                  }
                : c
            )
          );
        } else {
          console.warn("⚠️ Les messages reçus ne sont pas un tableau:", messages);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des messages :", err);
      }
    };

    loadMessages();
  }, [activeConversationId, currentUserId]);

  // Scroll automatique vers le bas à chaque mise à jour des messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  // Envoyer un message ou modifier un message existant
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversationId) {
      console.warn("⛔ Message vide ou aucune conversation active");
      return;
    }

    try {
      const activeConv = conversations.find(c => c.id === activeConversationId);
      if (!activeConv) {
        console.error("❌ Conversation active non trouvée");
        return;
      }

      console.log("📤 Envoi du message avec paramètres:", {
        destinataire_id: activeConv.cliniqueId,
        offre_id: activeConv.offreId,
        contenu: message,
        type_message: 'normal'
      });

      // Send the message with the correct parameters
      const sentMessage = await sendMessage({
        contenu: message,
        destinataire_id: activeConv.cliniqueId,
        offre_id: activeConv.offreId,
        expediteur_id: currentUserId,
        type_message: 'normal'
      });

      console.log("📨 Message envoyé:", sentMessage);

      // Reload messages with the correct parameters
      const updatedMessages = await fetchMessagesByConversation(
        currentUserId,
        activeConv.offreId
      );

      console.log("📨 Messages mis à jour après envoi:", updatedMessages);

      // Update conversations state with the new messages
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: updatedMessages,
                lastMessage: message,
                lastMessageDate: new Date().toISOString()
              }
            : c
        )
      );

      // Clear message input
      setMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error);
      setNotification({
        show: true,
        message: "Erreur lors de l'envoi du message",
        type: 'error'
      });
    }
  };

  // Supprimer un message existant
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Supprimer ce message ?")) return;

    try {
      await deleteMessage(messageId);

      const updatedMessages = await fetchMessagesByConversation(
        activeConversation.cliniqueId,
        currentUserId
      );

      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: updatedMessages,
                lastMessage: updatedMessages.at(-1)?.contenu || '',
                lastMessageDate: updatedMessages.at(-1)?.date_envoi || ''
              }
            : c
        )
      );

      setNotification({ show: true, message: 'Message supprimé', type: 'warning' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'warning' }), 3000);

    } catch (error) {
      console.error("Erreur lors de la suppression du message :", error);
    }

    setMessageActionsOpen(null);
  };

  // Afficher ou cacher le menu d'actions pour un message donné
  const toggleMessageActions = (id) => {
    setMessageActionsOpen(prev => (prev === id ? null : id));
  };

  // Formater la date d'un message de façon lisible
  const formatMessageDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("⚠️ Date invalide:", dateString);
        return '';
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return `${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Hier";
      } else {
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }
    } catch (error) {
      console.error("❌ Erreur de formatage de date:", error);
      return '';
    }
  };

  // Filtrer les conversations avec le terme de recherche
  const filteredConversations = conversations.filter(conv =>
    conv.cliniqueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.offerTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="professionnel-messagerie-container">
      {/* Panneau des conversations */}
      <div className="conversations-panel">
        <div className="conversations-header">
          <h1>Messagerie</h1>
          {newMessageMode ? (
            <button className="cancel-new-message" onClick={() => setNewMessageMode(false)}>
              <i className="fa-solid fa-arrow-left"></i> Annuler
            </button>
          ) : (
            <button className="new-message-button" onClick={() => setNewMessageMode(true)}>
              <i className="fa-solid fa-pen"></i>
            </button>
          )}
        </div>

        <div className="search-bar">
          <i className="fa-solid fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>

        <div className="conversations-list">
          {filteredConversations.map(conv => {
            const hasScheduledMeeting = conv.messages?.some(msg => msg.id_entretien);
            return (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setNewMessageMode(false);
                }}
              >
                <div className="conversation-avatar">
                  {conv.cliniqueAvatar?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div className="conversation-info">
                  <div className="conversation-info-header">
                    <span className="conversation-name">{conv.cliniqueName}</span>
                    <span className="conversation-time">{formatMessageDate(conv.lastMessageDate)}</span>
                  </div>

                  <div className="conversation-preview">
                    <span className="conversation-offer-title">{conv.offerTitle}</span>
                  </div>

                  {hasScheduledMeeting && (
                    <div className="badge-entretien-prevu">📅 Entretien prévu</div>
                  )}

                  <div className="conversation-message">
                    {conv.lastMessage.length > 50
                      ? conv.lastMessage.substring(0, 50) + '...'
                      : conv.lastMessage}
                    {conv.unread && <div className="unread-badge"></div>}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="no-conversations">
              <p>Aucune conversation trouvée</p>
            </div>
          )}
        </div>
      </div>

      {/* Panneau des messages */}
      <div className="messages-panel">
        {newMessageMode ? (
          <div className="new-message-placeholder">
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h2 className="empty-state-title">Nouveau message</h2>
              <p className="empty-state-subtitle">
                Sélectionnez une offre et un candidat à qui écrire.
              </p>
            </div>
          </div>
        ) : activeConversation ? (
          <>
            <div className="messages-header">
              <div className="contact-info">
                <div className="contact-avatar">
                  {activeConversation.cliniqueAvatar || '?'}
                </div>
                <div className="contact-details">
                  <h3 className="contact-name">{activeConversation.cliniqueName}</h3>
                  <span className="contact-offer">{activeConversation.offerTitle}</span>
                  {activeConversation.messages?.some(msg => msg.id_entretien) && (
                    <span className="badge-entretien-inline">📅 Entretien prévu</span>
                  )}
                </div>
              </div>
            </div>

            <div className="messages-content">
              {Array.isArray(activeConversation?.messages) ? (
                activeConversation.messages.map(msg => (
                  <div
                    key={msg.id_message}
                    className={`message ${msg.expediteur_id === currentUserId ? 'sent' : 'received'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-content">{msg.contenu}</div>
                      <div className="message-time">{formatMessageDate(msg.date_envoi)}</div>

                      {msg.expediteur_id === currentUserId && (
                        <button
                          className="message-options-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMessageActions(msg.id_message);
                          }}
                        >
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                      )}

                      {messageActionsOpen === msg.id_message && (
                        <div className="message-actions-menu">
                          <button onClick={() => handleDeleteMessage(msg.id_message)}>
                            <i className="fa-solid fa-trash"></i> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  <p>Aucun message dans cette conversation</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <form className="message-input-container" onSubmit={handleSendMessage}>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  className="message-input"
                  placeholder="Écrivez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="send-button" disabled={!message.trim()}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fa-regular fa-comments"></i>
              </div>
              <h2 className="empty-state-title">Vos messages</h2>
              <p className="empty-state-subtitle">
                Sélectionnez une conversation pour afficher les messages.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}
    </div>
  );
}
export default ProfessionnelMessagerie;  