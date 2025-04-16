import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useOffers } from '../components/OffersContext';
import '../styles/ProfessionnelMessagerie.css';

const ProfessionnelMessagerie = () => {
  const { conversationId } = useParams();
  const { offers, candidates } = useOffers();
  const messagesEndRef = useRef(null);
  
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour les messages
  const [message, setMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageActionsOpen, setMessageActionsOpen] = useState(null);
  
  // État pour les notifications
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // État pour les conversations
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Charger les données de conversation en fonction des offres et candidats
  useEffect(() => {
    if (offers && candidates) {
      // Créer des conversations à partir des offres et candidats
      const generatedConversations = offers
        .filter(offer => offer.status === 'active')  // Ne prendre que les offres actives
        .slice(0, 3)  // Limiter à 3 conversations pour cet exemple
        .map((offer, index) => {
          // ID de la clinique basé sur l'index pour cet exemple
          const cliniqueId = 100 + index + 1;
          
          // Trouver un potentiel candidat lié à cette offre
          const relatedCandidate = candidates.find(c => c.offerId === offer.id);
          
          // Message par défaut si aucun candidat lié
          let defaultMessage = "Bonjour, nous avons une offre qui pourrait vous intéresser...";
          let messagesArray = [];
          let isUnread = false;
          let messageDate = new Date();
          messageDate.setDate(messageDate.getDate() - index - 1);
          
          // Si on a trouvé un candidat, adapter le message
          if (relatedCandidate) {
            // Messages différents selon le statut du candidat
            if (relatedCandidate.status === 'selected') {
              defaultMessage = `Bonjour, nous avons bien reçu votre candidature pour le poste ${offer.title}. Votre profil nous intéresse et nous aimerions vous rencontrer pour un entretien.`;
              isUnread = true;
              
              messagesArray = [
                {
                  id: 1,
                  senderId: cliniqueId,
                  senderName: offer.cliniqueName,
                  content: defaultMessage,
                  timestamp: messageDate.toISOString(),
                  read: false
                }
              ];
            } else if (relatedCandidate.status === 'pending') {
              defaultMessage = `Suite à notre échange concernant le poste ${offer.title}, pouvez-vous nous indiquer vos disponibilités pour finaliser les détails ?`;
              isUnread = index === 0;
              
              messagesArray = [
                {
                  id: 1,
                  senderId: 'pro',
                  senderName: 'Vous',
                  content: `Bonjour, je me permets de vous contacter suite à mon entretien concernant le poste ${offer.title}. Je voulais savoir si vous aviez pu prendre une décision ?`,
                  timestamp: new Date(messageDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
                  read: true
                },
                {
                  id: 2,
                  senderId: cliniqueId,
                  senderName: offer.cliniqueName,
                  content: "Bonjour, nous avons été très satisfaits de notre entretien. Nous sommes en train de finaliser quelques aspects administratifs et vous recontacterons demain au plus tard.",
                  timestamp: new Date(messageDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
                  read: true
                },
                {
                  id: 3,
                  senderId: 'pro',
                  senderName: 'Vous',
                  content: 'Parfait, je vous remercie pour cette réponse rapide. Je reste disponible pour toute information complémentaire.',
                  timestamp: new Date(messageDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                  read: true
                },
                {
                  id: 4,
                  senderId: cliniqueId,
                  senderName: offer.cliniqueName,
                  content: defaultMessage,
                  timestamp: messageDate.toISOString(),
                  read: !isUnread
                }
              ];
            } else if (relatedCandidate.status === 'rejected') {
              defaultMessage = `Nous vous remercions pour votre candidature au poste ${offer.title}, mais nous avons décidé de retenir un profil plus adapté à nos besoins actuels. Nous gardons votre CV pour de futures opportunités.`;
              isUnread = false;
              
              messagesArray = [
                {
                  id: 1,
                  senderId: 'pro',
                  senderName: 'Vous',
                  content: `Bonjour, je souhaite postuler pour l'offre de ${offer.title}. Vous trouverez en pièce jointe mon CV et ma lettre de motivation.`,
                  timestamp: new Date(messageDate.getTime() - 48 * 60 * 60 * 1000).toISOString(),
                  read: true
                },
                {
                  id: 2,
                  senderId: cliniqueId,
                  senderName: offer.cliniqueName,
                  content: "Bonjour, nous vous remercions pour votre candidature. Nous l'examinerons attentivement et reviendrons vers vous dans les prochains jours.",
                  timestamp: new Date(messageDate.getTime() - 36 * 60 * 60 * 1000).toISOString(),
                  read: true
                },
                {
                  id: 3,
                  senderId: cliniqueId,
                  senderName: offer.cliniqueName,
                  content: defaultMessage,
                  timestamp: messageDate.toISOString(),
                  read: true
                }
              ];
            }
          } else {
            // Si pas de candidat, créer un simple message d'annonce d'offre
            messagesArray = [
              {
                id: 1,
                senderId: cliniqueId,
                senderName: offer.cliniqueName,
                content: defaultMessage,
                timestamp: messageDate.toISOString(),
                read: false
              }
            ];
            isUnread = true;
          }
          
          return {
            id: index + 1,
            cliniqueId,
            cliniqueName: offer.cliniqueName,
            cliniqueAvatar: offer.cliniqueName.charAt(0),
            offreId: offer.id,
            offreTitle: offer.title,
            lastMessage: defaultMessage,
            lastMessageDate: messageDate.toISOString(),
            unread: isUnread,
            messages: messagesArray
          };
        });
      
      setConversations(generatedConversations);
      
      // Sélection de la conversation active
      if (conversationId) {
        const targetConversation = generatedConversations.find(conv => conv.id === parseInt(conversationId));
        if (targetConversation) {
          setActiveConversationId(parseInt(conversationId));
        } else if (generatedConversations.length > 0) {
          setActiveConversationId(generatedConversations[0].id);
        }
      } else if (generatedConversations.length > 0) {
        setActiveConversationId(generatedConversations[0].id);
      }
    }
  }, [offers, candidates, conversationId]);
  
  // Conversation active
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  
  // Filtrer les conversations selon le terme de recherche
  const filteredConversations = conversations.filter(conv => 
    conv.cliniqueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.offreTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Défilement automatique vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);
  
  // Marquer une conversation comme lue lorsqu'elle est sélectionnée
  useEffect(() => {
    if (activeConversation?.unread) {
      markAsRead(activeConversationId);
    }
  }, [activeConversation, activeConversationId]);
  
  // Formater la date d'un message
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Si le message est d'aujourd'hui, afficher l'heure
    if (date.toDateString() === today.toDateString()) {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    // Si le message est d'hier, afficher "Hier"
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier`;
    }
    // Sinon, afficher la date courte
    else {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
  };
  
  // Marquer une conversation comme lue
  const markAsRead = (convId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === convId) {
          // Marquer tous les messages comme lus
          const updatedMessages = conv.messages.map(msg => ({
            ...msg,
            read: true
          }));
          
          return {
            ...conv,
            unread: false,
            messages: updatedMessages
          };
        }
        return conv;
      })
    );
  };
  
  // Sélectionner une conversation
  const selectConversation = (convId) => {
    setActiveConversationId(convId);
  };
  
  // Envoyer un message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() === '' || !activeConversation) return;
    
    // Si on est en mode édition, on modifie le message existant
    if (editingMessage) {
      handleUpdateMessage(editingMessage.id, message);
      setEditingMessage(null);
      setMessage('');
      return;
    }
    
    // Créer le nouveau message
    const newMessage = {
      id: Date.now(),
      senderId: 'pro',
      senderName: 'Vous',
      content: message,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    // Mettre à jour les conversations
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: message,
            lastMessageDate: new Date().toISOString(),
            messages: [...conv.messages, newMessage]
          };
        }
        return conv;
      })
    );
    
    setMessage('');
    
    // Faire défiler automatiquement vers le nouveau message
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  // Supprimer un message
  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === activeConversationId) {
            // Filtrer pour enlever le message à supprimer
            const updatedMessages = conv.messages.filter(msg => msg.id !== messageId);
            
            // Mettre à jour le dernier message si nécessaire
            const lastMessage = updatedMessages.length > 0 
              ? updatedMessages[updatedMessages.length - 1] 
              : null;
            
            return {
              ...conv,
              messages: updatedMessages,
              lastMessage: lastMessage ? lastMessage.content : "Aucun message",
              lastMessageDate: lastMessage ? lastMessage.timestamp : conv.lastMessageDate
            };
          }
          return conv;
        })
      );
      
      setNotification({
        show: true,
        message: 'Message supprimé',
        type: 'warning'
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'warning' });
      }, 3000);
    }
    
    setMessageActionsOpen(null);
  };
  
  // Mettre en mode édition un message
  const handleEditMessage = (msg) => {
    setEditingMessage(msg);
    setMessage(msg.content);
    setMessageActionsOpen(null);
  };
  
  // Mettre à jour un message
  const handleUpdateMessage = (messageId, newContent) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === activeConversationId) {
          // Mettre à jour le message
          const updatedMessages = conv.messages.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                content: newContent,
                edited: true
              };
            }
            return msg;
          });
          
          // Vérifier si le message modifié est le dernier
          const lastMsg = conv.messages[conv.messages.length - 1];
          const isLastMessage = lastMsg && lastMsg.id === messageId;
          
          return {
            ...conv,
            messages: updatedMessages,
            lastMessage: isLastMessage ? newContent : conv.lastMessage
          };
        }
        return conv;
      })
    );
    
    setNotification({
      show: true,
      message: 'Message modifié',
      type: 'success'
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessage('');
  };
  
  // Basculer l'affichage du menu d'actions pour un message
  const toggleMessageActions = (messageId) => {
    setMessageActionsOpen(messageActionsOpen === messageId ? null : messageId);
  };
  
  return (
    <div className="professionnel-messagerie-container">
      {/* Panneau des conversations */}
      <div className="conversations-panel">
        <div className="conversations-header">
          <h1>Messagerie</h1>
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
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        
        <div className="conversations-list">
          {filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
              onClick={() => selectConversation(conv.id)}
            >
              <div className="conversation-avatar">
                {conv.cliniqueAvatar}
              </div>
              
              <div className="conversation-info">
                <div className="conversation-info-header">
                  <span className="conversation-name">{conv.cliniqueName}</span>
                  <span className="conversation-time">{formatMessageDate(conv.lastMessageDate)}</span>
                </div>
                
                <div className="conversation-preview">
                  <span className="conversation-offer-title">{conv.offreTitle}</span>
                </div>
                
                <div className="conversation-message">
                  {conv.lastMessage.length > 50 
                    ? conv.lastMessage.substring(0, 50) + '...' 
                    : conv.lastMessage}
                  {conv.unread && <div className="unread-badge"></div>}
                </div>
              </div>
            </div>
          ))}
          
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
                  {activeConversation.cliniqueAvatar}
                </div>
                <div className="contact-details">
                  <h3 className="contact-name">{activeConversation.cliniqueName}</h3>
                  <span className="contact-offer">{activeConversation.offreTitle}</span>
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
                    <div className="message-time">
                      {formatMessageDate(msg.timestamp)}
                    </div>
                    
                    {/* Bouton d'options pour les messages envoyés */}
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
                    
                    {/* Menu d'actions pour les messages */}
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
                    <button type="button" onClick={handleCancelEdit} className="cancel-edit-button">
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
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i> {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProfessionnelMessagerie;