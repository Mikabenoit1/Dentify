import React, { useState, useEffect, useRef } from 'react';
import { useOffers } from '../components/OffersContext';
import { useParams } from 'react-router-dom'; // Import pour récupérer le paramètre de l'URL
import ScheduleMeeting from '../components/ScheduleMeeting';
import '../styles/CliniqueMessagerie.css';

const CliniqueMessagerie = () => {
  const { conversationId } = useParams(); // Récupération de l'ID de conversation depuis l'URL
  const { offers, addMeeting, deleteMeeting } = useOffers();
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  
  // État pour la modal de planification
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  // État pour afficher une notification
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // État pour édition de message
  const [editingMessage, setEditingMessage] = useState(null);

  // État pour les menus d'options de message
  const [messageActionsOpen, setMessageActionsOpen] = useState(null);

  // Données fictives pour la démonstration
  const [conversations, setConversations] = useState([
    {
      id: 1,
      candidatId: 101,
      candidatName: 'Dr. Leslie Labrecque',
      candidatProfession: 'dentiste',
      offerId: 1,
      offerTitle: 'Remplacement dentiste été 2023',
      lastMessage: "Bonjour, je suis intéressée par votre offre de remplacement pour l'été. Pouvez-vous me donner plus de détails sur les équipements disponibles dans votre cabinet ?",
      lastMessageDate: '2023-06-10T14:30:00',
      unread: true,
      messages: [
        {
          id: 1,
          senderId: 101,
          senderName: 'Dr. Leslie Labrecque',
          content: "Bonjour, je suis intéressée par votre offre de remplacement pour l'été. Pouvez-vous me donner plus de détails sur les équipements disponibles dans votre cabinet ?",
          timestamp: '2023-06-10T14:30:00',
          read: false
        }
      ]
    },
    {
      id: 2,
      candidatId: 102,
      candidatName: 'Thomas Simard',
      candidatProfession: 'assistant',
      offerId: 2,
      offerTitle: 'Recherche assistant(e) dentaire',
      lastMessage: "Merci pour les informations. Je voudrais savoir si le poste peut évoluer vers un CDI après la période de remplacement ?",
      lastMessageDate: '2023-06-09T10:15:00',
      unread: false,
      messages: [
        {
          id: 1,
          senderId: 'clinic',
          senderName: 'Votre Clinique',
          content: "Bonjour Thomas Simard, nous avons bien reçu votre candidature pour le poste d'assistant dentaire. Pourriez-vous nous préciser vos disponibilités ?",
          timestamp: '2023-06-08T09:45:00',
          read: true
        },
        {
          id: 2,
          senderId: 102,
          senderName: 'Thomas Simard',
          content: "Bonjour, je suis disponible du lundi au vendredi, de 8h à 18h. J'ai 5 ans d'expérience en tant qu'assistant dentaire.",
          timestamp: '2023-06-09T08:30:00',
          read: true
        },
        {
          id: 3,
          senderId: 'clinic',
          senderName: 'Votre Clinique',
          content: "Parfait, merci pour ces précisions. Notre offre concerne un remplacement de 3 mois, avec possibilité de prolongation selon les besoins du cabinet.",
          timestamp: '2023-06-09T09:20:00',
          read: true
        },
        {
          id: 4,
          senderId: 102,
          senderName: 'Thomas Simard',
          content: "Merci pour les informations. Je voudrais savoir si le poste peut évoluer vers un CDI après la période de remplacement ?",
          timestamp: '2023-06-09T10:15:00',
          read: true
        }
      ]
    },
    {
      id: 3,
      candidatId: 103,
      candidatName: 'Marie Curie',
      candidatProfession: 'hygieniste',
      offerId: 3,
      offerTitle: 'Remplacement hygiéniste dentaire',
      lastMessage: "Bonjour, suite à notre entretien téléphonique, je vous confirme mon intérêt pour le poste. Quelles seraient les prochaines étapes ?",
      lastMessageDate: '2023-06-05T16:45:00',
      unread: true,
      messages: [
        {
          id: 1,
          senderId: 103,
          senderName: 'Marie Curie',
          content: "Bonjour, je me permets de vous contacter au sujet de votre annonce pour un remplacement d'hygiéniste dentaire. J'ai 7 ans d'expérience et je serais disponible aux dates mentionnées.",
          timestamp: '2023-06-04T11:30:00',
          read: true
        },
        {
          id: 2,
          senderId: 'clinic',
          senderName: 'Votre Clinique',
          content: "Bonjour Mme Curie, merci pour votre intérêt. Nous serions ravis d'échanger avec vous par téléphone pour discuter de vos expériences précédentes. Seriez-vous disponible demain entre 14h et 16h ?",
          timestamp: '2023-06-04T14:20:00',
          read: true
        },
        {
          id: 3,
          senderId: 103,
          senderName: 'Marie Curie',
          content: "Bonjour, je serai disponible demain à 15h. Vous pouvez me joindre au 06 XX XX XX XX.",
          timestamp: '2023-06-04T15:10:00',
          read: true
        },
        {
          id: 4,
          senderId: 103,
          senderName: 'Marie Curie',
          content: "Bonjour, suite à notre entretien téléphonique, je vous confirme mon intérêt pour le poste. Quelles seraient les prochaines étapes ?",
          timestamp: '2023-06-05T16:45:00',
          read: false
        }
      ]
    }
  ]);
  
  // ID de la conversation active
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Conversation active (dérivée de l'ID et de l'état des conversations)
  const activeConversation = conversations.find(conv => conv.id === activeConversationId) || null;

  // Sélectionner la conversation en fonction de l'ID dans l'URL
  useEffect(() => {
    if (conversationId) {
      // Convertir en nombre si c'est une chaîne
      const targetId = parseInt(conversationId, 10);
      const foundConversation = conversations.find(conv => conv.id === targetId);
      
      if (foundConversation) {
        setActiveConversationId(targetId);
      } else if (conversations.length > 0) {
        // Si la conversation n'est pas trouvée, utilisez la première
        setActiveConversationId(conversations[0].id);
      }
    } else if (conversations.length > 0 && !activeConversationId) {
      // Si aucun ID n'est fourni, utilisez la première conversation
      setActiveConversationId(conversations[0].id);
    }
  }, [conversationId, conversations]);

  // Format de date français
  const formatFrenchDate = (date) => {
    const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const jour = joursSemaine[date.getDay()];
    const numeroDuJour = date.getDate();
    const nomDuMois = mois[date.getMonth()];
    const annee = date.getFullYear();
    
    return `${jour} ${numeroDuJour} ${nomDuMois} ${annee}`;
  };

  // Fonction pour formater la date d'un message (suite)
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

  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(conv => {
    return conv.candidatName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           conv.offerTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Fonction pour marquer une conversation comme lue
  const markAsRead = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
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

  // Gérer l'envoi d'un nouveau message
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
      senderId: 'clinic',
      senderName: 'Votre Clinique',
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

  // Fonction pour supprimer un message
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
      
      // Afficher une notification
      setNotification({
        show: true,
        message: 'Message supprimé',
        type: 'warning'
      });
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'warning' });
      }, 3000);
    }
    
    // Fermer le menu d'actions
    setMessageActionsOpen(null);
  };

  // Mettre en mode édition un message
  const handleEditMessage = (msg) => {
    setEditingMessage(msg);
    setMessage(msg.content);
    
    // Fermer le menu d'actions
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
                edited: true // Ajouter un indicateur que le message a été édité
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
            // Mettre à jour lastMessage si nécessaire
            lastMessage: isLastMessage ? newContent : conv.lastMessage
          };
        }
        return conv;
      })
    );
    
    // Afficher une notification
    setNotification({
      show: true,
      message: 'Message modifié',
      type: 'success'
    });
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessage('');
  };

  // Faire défiler automatiquement vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  useEffect(() => {
    if (activeConversation?.unread) {
      markAsRead(activeConversationId);
    }
  }, [activeConversation, activeConversationId]);

  // Fermer le menu d'actions si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageActionsOpen && !event.target.closest('.message-actions-menu') && 
          !event.target.closest('.message-options-button')) {
        setMessageActionsOpen(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [messageActionsOpen]);

  // Ouvrir la modal de planification
  const handleOpenScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  // Fonction pour gérer la planification d'un rendez-vous
  const handleScheduleMeeting = (meetingData) => {
    // Créer un nouveau rendez-vous
    const newMeeting = addMeeting(meetingData);
    
    // Formater la date pour le message
    const meetingDate = new Date(meetingData.date);
    const formattedDate = formatFrenchDate(meetingDate);
    
    // Déterminer le type de rencontre pour le message
    const meetingTypeText = 
      meetingData.meetingType === 'video' ? 'une vidéoconférence' : 
      meetingData.meetingType === 'phone' ? 'un appel téléphonique' : 
      'une rencontre en personne';
    
    // Créer un message avec un format plus convivial et détaillé
    const meetingMessage = {
      id: Date.now(),
      senderId: 'clinic',
      senderName: 'Votre Clinique',
      content: `📅 J'ai planifié ${meetingTypeText} pour le ${formattedDate} de ${meetingData.startTime} à ${meetingData.endTime}.\n\n${meetingData.notes ? `Notes: ${meetingData.notes}\n\n` : ''}Merci de confirmer votre disponibilité.`,
      timestamp: new Date().toISOString(),
      read: true,
      isMeetingMessage: true,
      meetingId: newMeeting.id
    };
    
    // Mettre à jour les conversations
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: meetingMessage.content.split('\n')[0], // Juste la première ligne pour l'aperçu
            lastMessageDate: meetingMessage.timestamp,
            messages: [...conv.messages, meetingMessage]
          };
        }
        return conv;
      })
    );
    
    // Afficher une notification
    setNotification({
      show: true,
      message: 'Rendez-vous planifié avec succès',
      type: 'success'
    });
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Annuler un rendez-vous depuis le chat
  const handleCancelMeeting = (meetingId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      // Supprimer le rendez-vous
      deleteMeeting(meetingId);
      
      // Ajouter un message d'annulation
      const cancellationMessage = {
        id: Date.now(),
        senderId: 'clinic',
        senderName: 'Votre Clinique',
        content: "❌ Le rendez-vous a été annulé.",
        timestamp: new Date().toISOString(),
        read: true,
        isCancellationMessage: true
      };
      
      // Mettre à jour les conversations
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              lastMessage: cancellationMessage.content,
              lastMessageDate: cancellationMessage.timestamp,
              messages: [...conv.messages, cancellationMessage]
            };
          }
          return conv;
        })
      );
      
      // Afficher une notification
      setNotification({
        show: true,
        message: 'Rendez-vous annulé',
        type: 'warning'
      });
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'warning' });
      }, 3000);
    }
  };

  // Basculer l'affichage du menu d'actions pour un message
  const toggleMessageActions = (messageId) => {
    setMessageActionsOpen(messageActionsOpen === messageId ? null : messageId);
  };

  return (
    <div className="clinique-messagerie-container">
      {/* Panneau des conversations */}
      <div className="conversations-panel">
        <div className="conversations-header">
          <h1>Messagerie</h1>
          <button className="new-message-button">
            <i className="fa-solid fa-pen"></i>
          </button>
        </div>
        
        <div className="search-bar">
          <i className="fa-solid fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="conversations-list">
          {filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
              onClick={() => setActiveConversationId(conv.id)}
            >
              <div className={`conversation-avatar ${conv.candidatProfession}`}>
                {conv.candidatName.charAt(0).toUpperCase()}
              </div>
              
              <div className="conversation-info">
                <div className="conversation-info-header">
                  <span className="conversation-name">{conv.candidatName}</span>
                  <span className="conversation-time">{formatMessageDate(conv.lastMessageDate)}</span>
                </div>
                
                <div className="conversation-preview">
                  {conv.lastMessage.length > 40 
                    ? conv.lastMessage.substring(0, 40) + '...' 
                    : conv.lastMessage}
                  {conv.unread && <div className="unread-badge"></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Panneau des messages */}
      <div className="messages-panel">
        {activeConversation ? (
          <>
            <div className="messages-header">
              <div className="contact-display">
                <div className={`contact-avatar ${activeConversation.candidatProfession}`}>
                  {activeConversation.candidatName.charAt(0).toUpperCase()}
                </div>
                <h3 className="contact-name-header">{activeConversation.candidatName}</h3>
              </div>
              
              <div className="messages-header-actions">
                <button className="schedule-button" onClick={handleOpenScheduleModal}>
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Planifier</span>
                </button>
                <button className="header-action-button">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
              </div>
            </div>
            <div className="offer-title-bar">
              {activeConversation.offerTitle}
            </div>
                        
            <div className="messages-content">
              {activeConversation.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.senderId === 'clinic' ? 'sent' : 'received'} ${msg.isMeetingMessage ? 'meeting-message' : ''} ${msg.isCancellationMessage ? 'cancellation-message' : ''}`}
                >
                  <div className="message-bubble">
                    {msg.content}
                    {msg.edited && <span className="message-edited">(modifié)</span>}
                    <div className="message-time">
                      {formatMessageDate(msg.timestamp)}
                    </div>
                    
                    {/* Bouton d'options pour les messages de la clinique (non meetings) */}
                    {msg.senderId === 'clinic' && !msg.isMeetingMessage && !msg.isCancellationMessage && (
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
                    
                    {msg.isMeetingMessage && (
                      <div className="meeting-message-actions">
                        <button 
                          className="cancel-meeting-button"
                          onClick={() => handleCancelMeeting(msg.meetingId)}
                        >
                          Annuler le rendez-vous
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form className="message-input-container" onSubmit={handleSendMessage}>
              <button type="button" className="input-action-button">
                <i className="fa-solid fa-paperclip"></i>
              </button>
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
                Sélectionnez une conversation pour afficher les messages ou commencez une nouvelle discussion.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de planification de rendez-vous */}
      <ScheduleMeeting 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        candidat={activeConversation ? {
          id: activeConversation.candidatId,
          name: activeConversation.candidatName,
          profession: activeConversation.candidatProfession
        } : null}
        offerId={activeConversation?.offerId}
        onSchedule={handleScheduleMeeting}
      />
      
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i> {notification.message}
        </div>
      )}
    </div>
  );
};

export default CliniqueMessagerie;