import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ScheduleMeeting from '../components/ScheduleMeeting';
import {
  fetchConversations,
  fetchMessagesByConversation,
  sendMessage,
  deleteMessage,
  updateMessage,
  markAsRead
} from '../lib/messageApi';
import { fetchUserProfile } from '../lib/userApi'; // 👈 remplace clinicProfile
import '../styles/ProfessionnelMessagerie.css'; // 👈 remplace CliniqueMessagerie.css

function ProfessionnelMessagerie() {
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageActionsOpen, setMessageActionsOpen] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newMessageMode, setNewMessageMode] = useState(false);
  


  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

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
        const data = await fetchConversations(); // backend doit retourner les conversations du professionnel
        setConversations(data);

        if (conversationId) {
          setActiveConversationId(parseInt(conversationId));
        } else if (data.length > 0) {
          setActiveConversationId(data[0].id); // ou id de conversation réel
        }
      } catch (err) {
        console.error("Erreur lors du chargement des conversations :", err);
      }
    };

    loadConversations();
  }, [conversationId]);

  // Charger les messages liés à la conversation active
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId || !currentUserId) return;

      const conv = conversations.find(c => c.id === activeConversationId);
      if (!conv) return;

      try {
        const messages = await fetchMessagesByConversation(conv.cliniqueId, conv.offreId);
        setConversations(prev =>
          prev.map(c =>
            c.id === activeConversationId ? { ...c, messages } : c
          )
        );

        // Marquer comme lus les messages non lus destinés au professionnel
        await Promise.all(messages.map(msg =>
          !msg.read && msg.destinataire_id === currentUserId ? markAsRead(msg.id) : null
        ));
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
      if (!message.trim() || !activeConversation) return;
  
      try {
        if (editingMessage) {
          await updateMessage(editingMessage.id, message);
        } else {
          await sendMessage({
            contenu: message,
            offre_id: activeConversation.offreId,
            destinataire_id: activeConversation.cliniqueId // 👈 professionnel envoie à la clinique
          });
        }
  
        const updatedMessages = await fetchMessagesByConversation(activeConversation.cliniqueId, activeConversation.offreId);
  
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
  
        setMessage('');
        setEditingMessage(null);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  
      } catch (error) {
        console.error("Erreur lors de l'envoi ou de l'édition du message :", error);
      }
    };
  
    // Passer un message en mode édition
    const handleEditMessage = (msg) => {
      setEditingMessage(msg);
      setMessage(msg.contenu);
      setMessageActionsOpen(null);
    };
  
    // Supprimer un message
    const handleDeleteMessage = async (messageId) => {
      if (!window.confirm("Supprimer ce message ?")) return;
  
      try {
        await deleteMessage(messageId);
  
        const updatedMessages = await fetchMessagesByConversation(
          activeConversation.cliniqueId,
          activeConversation.offreId
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
  
    // Annuler l'édition
    const handleCancelEdit = () => {
      setEditingMessage(null);
      setMessage('');
    };
  
    // Ouvrir/fermer le menu d'options d’un message
    const toggleMessageActions = (id) => {
      setMessageActionsOpen(prev => (prev === id ? null : id));
    };
  
    // Ouvrir la modal de planification (facultatif)
    const handleOpenScheduleModal = () => {
      setIsScheduleModalOpen(true);
    };
  

  // Formater la date d'un message de façon lisible
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
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
  };

  // Filtrer les conversations avec le terme de recherche
  const filteredConversations = conversations.filter(conv =>
    conv.cliniqueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.offreTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                    <span className="conversation-offer-title">{conv.offreTitle}</span>
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
                  <span className="contact-offer">{activeConversation.offreTitle}</span>
                  {activeConversation.messages?.some(msg => msg.id_entretien) && (
                    <span className="badge-entretien-inline">📅 Entretien prévu</span>
                  )}
                </div>
              </div>
            </div>
  
            <div className="messages-content">
              {activeConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === 'pro' ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    {msg.content}
                    {msg.edited && <span className="message-edited">(modifié)</span>}
                    <div className="message-time">{formatMessageDate(msg.timestamp)}</div>
  
                    {msg.senderId === 'pro' && (
                      <button
                        className="message-options-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageActions(msg.id);
                        }}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                    )}
  
                    {messageActionsOpen === msg.id && (
                      <div className="message-actions-menu">
                        <button onClick={() => handleEditMessage(msg)}>
                          <i className="fa-solid fa-edit"></i> Modifier
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id)}>
                          <i className="fa-solid fa-trash"></i> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
  
            <form className="message-input-container" onSubmit={handleSendMessage}>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  className="message-input"
                  placeholder={editingMessage ? "Modifier votre message..." : "Écrivez votre message..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {editingMessage && (
                  <div className="editing-indicator">
                    <span>Modification en cours</span>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="cancel-edit-button"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="send-button"
                disabled={!message.trim()}
              >
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