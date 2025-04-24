import React, { useState, useEffect, useRef } from 'react';
import { fetchConversations, fetchMessagesByConversation, sendMessage, deleteMessage } from '../lib/messageApi';
import { fetchUserProfile } from '../lib/userApi';
import '../styles/ProfessionnelMessagerie.css';

function ProfessionnelMessagerie() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageActionsOpen, setMessageActionsOpen] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [currentUserId, setCurrentUserId] = useState(null);

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Charger le profil du professionnel connecté
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await fetchUserProfile();
        console.log("👤 Profil professionnel chargé:", profile);
        setCurrentUserId(profile.id_utilisateur);
      } catch (err) {
        console.error("❌ Erreur lors du chargement du profil professionnel:", err);
      }
    };
    loadCurrentUser();
  }, []);

  // Charger les conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        console.log("📥 Raw conversations data:", data);
  
        if (!Array.isArray(data)) {
          console.error("❌ Format invalide des conversations:", data);
          return;
        }
  
        const grouped = {};
  
        for (const conv of data) {
          const key = conv.id;
          console.log("🔄 Processing conversation:", conv);
  
          if (!grouped[key] || new Date(conv.dateMessage) > new Date(grouped[key].lastMessageDate)) {
            grouped[key] = {
              id: key,
              cliniqueId: conv.id_utilisateur,
              offreId: parseInt(conv.id_offre),
              cliniqueName: `${conv.prenom || ''} ${conv.nom || ''}`.trim() || 'Clinique',
              titre_offre: conv.titre_offre || 'Offre sans titre',
              lastMessage: conv.dernierMessage || '',
              lastMessageDate: conv.dateMessage || new Date().toISOString(),
              unreadCount: conv.nonLu || 0,
              messages: [],
              groupedMessages: {}
            };
            console.log("✅ Created/Updated conversation:", grouped[key]);
          }
        }
  
        const sortedConversations = Object.values(grouped).sort((a, b) =>
          new Date(b.lastMessageDate) - new Date(a.lastMessageDate)
        );
  
        console.log("✨ Final conversations:", sortedConversations);
        setConversations(sortedConversations);
  
        // Si une conversation est active, charger ses messages
        if (activeConversationId) {
          const activeConv = sortedConversations.find(c => c.id === activeConversationId);
          if (activeConv) {
            console.log("🎯 Loading messages for active conversation:", activeConv);
            const messages = await fetchMessagesByConversation(activeConv.cliniqueId, activeConv.offreId);
            if (Array.isArray(messages)) {
              // Grouper les messages par date
              const groupedMessages = messages.reduce((groups, msg) => {
                const date = new Date(msg.date_envoi).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                });
  
                if (!groups[date]) {
                  groups[date] = [];
                }
  
                groups[date].push(msg);
                return groups;
              }, {});
  
              setConversations(prev =>
                prev.map(c =>
                  c.id === activeConversationId
                    ? {
                        ...c,
                        messages,
                        groupedMessages,
                        lastMessage: messages[messages.length - 1]?.contenu || '',
                        lastMessageDate: messages[messages.length - 1]?.date_envoi || new Date().toISOString()
                      }
                    : c
                )
              );
            }
          }
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des conversations:", error);
        setNotification({
          show: true,
          message: "Erreur lors du chargement des conversations",
          type: 'error'
        });
      }
    };
  
    loadConversations();
  }, [currentUserId, activeConversationId]);

  // Charger les messages pour la conversation active
  useEffect(() => {
    const loadMessages = async (conversation) => {
      if (!conversation) {
        console.warn("⚠️ Aucune conversation fournie à loadMessages");
        return;
      }

      try {
        console.log("🔄 Chargement des messages pour la conversation:", conversation);

        const messages = await fetchMessagesByConversation(conversation.cliniqueId, conversation.offreId);

        if (!Array.isArray(messages)) {
          console.warn("⚠️ Format de messages invalide:", messages);
          return;
        }

        console.log("📨 Messages reçus:", messages);

        // Grouper les messages par date
        const groupedMessages = messages.reduce((groups, message) => {
          const date = new Date(message.date_envoi).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          });

          if (!groups[date]) {
            groups[date] = [];
          }

          groups[date].push(message);
          return groups;
        }, {});

        // Trier les messages dans chaque groupe
        Object.keys(groupedMessages).forEach(date => {
          groupedMessages[date].sort((a, b) => 
            new Date(a.date_envoi) - new Date(b.date_envoi)
          );
        });

        console.log("📨 Messages groupés:", groupedMessages);

        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === activeConversationId
              ? { 
                  ...conv, 
                  messages,
                  groupedMessages,
                  lastMessage: messages[messages.length - 1]?.contenu || conv.lastMessage,
                  lastMessageDate: messages[messages.length - 1]?.date_envoi || conv.lastMessageDate
                }
              : conv
          )
        );

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des messages:", error);
      }
    };

    if (activeConversationId) {
      const activeConv = conversations.find(c => c.id === activeConversationId);
      if (activeConv) {
        loadMessages(activeConv);
      }
    }
  }, [activeConversationId, currentUserId]);

  // Scroll automatique vers le bas des messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

const handleSendMessage = async (e) => {
  e.preventDefault();

  if (!message.trim() || !activeConversation) {
    console.warn("⛔ Message vide ou aucune conversation active.");
    return;
  }

  try {
    const offreId = parseInt(activeConversation.offreId);
    if (!offreId) {
      setNotification({
        show: true,
        message: "Erreur: conversation invalide",
        type: 'error'
      });
      return;
    }

    const messageData = {
      contenu: message.trim(),
      destinataire_id: parseInt(activeConversation.cliniqueId),
      offre_id: offreId,
      type_message: 'normal',
      expediteur_id: parseInt(currentUserId),
      id_conversation: activeConversation.id
    };

    const sentMessage = await sendMessage(messageData);
    const now = new Date();
    const today = now.toLocaleDateString('fr-FR');

    const newMessage = {
      ...sentMessage,
      date_envoi: now.toISOString()
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: [...(c.messages || []), newMessage],
              groupedMessages: {
                ...c.groupedMessages,
                [today]: [
                  ...(c.groupedMessages[today] || []),
                  newMessage
                ]
              },
              lastMessage: newMessage.contenu,
              lastMessageDate: newMessage.date_envoi
            }
          : c
      )
    );

    setMessage('');
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
        currentUserId,
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
      console.error("Erreur lors de la suppression du message:", error);
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
    conv.titre_offre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="professionnel-messagerie-container">
      {/* Panneau des conversations */}
      <div className="conversations-panel">
        <div className="conversations-header">
          <h1>Messagerie</h1>
        </div>

        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {filteredConversations.map(conv => {
            const hasScheduledMeeting = conv.messages?.some(msg => msg.id_entretien);
            return (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => {
                  setActiveConversationId(conv.id);
                }}
              >
                <div className="conversation-avatar">
                  {conv.cliniqueName?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div className="conversation-info">
                  <div className="conversation-info-header">
                    <span className="conversation-name">{conv.cliniqueName}</span>
                    <span className="conversation-time">{formatMessageDate(conv.lastMessageDate)}</span>
                  </div>

                  <div className="conversation-preview">
                    <span className="conversation-offer-title">{conv.titre_offre}</span>
                  </div>

                  {hasScheduledMeeting && (
                    <div className="badge-entretien-prevu">📅 Entretien prévu</div>
                  )}

                  <div className="conversation-message">
                    {conv.lastMessage.length > 50
                      ? conv.lastMessage.substring(0, 50) + '...'
                      : conv.lastMessage}
                    {conv.unreadCount > 0 && <div className="unread-badge"></div>}
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
        {activeConversation ? (
          <>
            <div className="messages-header">
              <div className="contact-info">
                <div className="contact-avatar">
                  {activeConversation.cliniqueName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="contact-details">
                  <h3 className="contact-name">{activeConversation.cliniqueName}</h3>
                  <span className="contact-offer">{activeConversation.titre_offre}</span>
                  {activeConversation.messages?.some(msg => msg.id_entretien) && (
                    <span className="badge-entretien-inline">📅 Entretien prévu</span>
                  )}
                </div>
              </div>
            </div>

            <div className="messages-content">
              {activeConversation?.groupedMessages ? (
                Object.entries(activeConversation.groupedMessages)
                  .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                  .map(([date, messages]) => (
                    <div key={date} className="message-group">
                      <div className="message-date-separator">
                        <span>{date}</span>
                      </div>
                      {messages.map(msg => {
                        const isCandidatureMessage = msg.contenu?.toLowerCase().includes('candidature');
                        const isProfessionnel = msg.expediteur_id === currentUserId;
                        
                        return msg.type_message === 'systeme' ? (
                          <div key={msg.id_message} className="message-system">
                            <span>
                              {isCandidatureMessage ? (
                                isProfessionnel ? 'Nouvelle candidature envoyée' : 'Nouvelle candidature reçue'
                              ) : msg.contenu}
                            </span>
                            <small className="message-time">
                              {new Date(msg.date_envoi).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          </div>
                        ) : (
                          <div
                            key={msg.id_message}
                            className={`message ${msg.expediteur_id === currentUserId ? 'sent' : 'received'}`}
                          >
                            <div className="message-bubble">
                              <div className="message-content">{msg.contenu}</div>
                              <div className="message-time">
                                {new Date(msg.date_envoi).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                {msg.est_lu && msg.expediteur_id === currentUserId && (
                                  <span className="message-status">✓✓</span>
                                )}
                              </div>

                              {msg.expediteur_id === currentUserId && !msg.isMeetingMessage && (
                                <button
                                  className="message-options-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMessageActions(msg.id_message);
                                  }}
                                >
                                  <i className="fas fa-ellipsis-v"></i>
                                </button>
                              )}

                              {messageActionsOpen === msg.id_message && (
                                <div className="message-actions-menu">
                                  <button onClick={() => handleDeleteMessage(msg.id_message)}>
                                    <i className="fas fa-trash"></i> Supprimer
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fas fa-comments"></i>
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
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default ProfessionnelMessagerie;  