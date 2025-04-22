import React, { useState, useEffect, useRef } from 'react';
import {
  fetchConversations,
  fetchMessagesByConversation,
  sendMessage,
  deleteMessage
} from '../lib/messageApi';
import { fetchClinicProfile, fetchClinicOffers, fetchApplicantsByOffer } from '../lib/clinicApi';
import { apiFetch } from '../lib/apiFetch';
import '../styles/CliniqueMessagerie.css';

function CliniqueMessagerie() {
  const [conversations, setConversations] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [messageActionsOpen, setMessageActionsOpen] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newMessageMode, setNewMessageMode] = useState(false);
  const [clinicOffers, setClinicOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Charger le profil de la clinique connectée
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await fetchClinicProfile();
        console.log("📋 Profil clinique reçu :", profile);
  
        // Get the user ID from the profile response
        // The profile data is transformed in clinicApi.js, so we need to get the original data
        const userData = await apiFetch('/users/profile');
        const userId = userData?.id_utilisateur;
  
        if (!userId) {
          console.warn("⚠️ Impossible d'extraire l'ID utilisateur depuis le profil :", userData);
        } else {
          console.log("✅ ID utilisateur clinique :", userId);
          setCurrentUserId(userId);
        }
      } catch (err) {
        console.error("❌ Erreur lors du chargement du profil clinique :", err);
      }
    };
  
    loadCurrentUser();
  }, []);
  
  

  // Charger les conversations disponibles
  useEffect(() => {
    const transformConversations = (data) => {
      console.log("🔄 Transforming conversations from:", data);
      if (!Array.isArray(data)) {
        console.error("❌ Invalid data format for conversations:", data);
        return [];
      }

      return data.map(conv => {
        // Log the entire conversation object to see its structure
        console.log("🔍 Raw conversation data:", conv);

        // For clinics, the candidatId is the professional's ID (id_utilisateur)
        const candidatId = conv.id_utilisateur;
        // For now, we're using a fixed offreId
        const offreId = 20;

        console.log("📝 Creating conversation:", { 
          raw: conv,
          candidatId,
          offreId,
          currentUserId,
          nom: conv.nom,
          prenom: conv.prenom
        });

        // Skip if we don't have a valid candidatId
        if (!candidatId) {
          console.warn("⚠️ Missing candidatId for conversation:", conv);
          return null;
        }

        return {
          id: `${offreId}-${candidatId}`,
          candidatId: candidatId,
          offreId: offreId,
          name: `${conv.prenom || ''} ${conv.nom || ''}`.trim() || 'Utilisateur inconnu',
          profession: conv.profession || 'Non spécifié',
          lastMessage: conv.dernierMessage || 'Aucun message',
          lastMessageDate: conv.dateMessage || new Date().toISOString(),
          unreadCount: conv.nonLu || 0
        };
      }).filter(Boolean);
    };

    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        console.log("📥 Raw conversations data:", data);
        const transformed = transformConversations(data);
        console.log("✨ Transformed conversations:", transformed);
        
        if (transformed.length === 0) {
          console.warn("⚠️ No valid conversations were transformed");
        }
        
        setConversations(transformed);
      } catch (error) {
        console.error("❌ Error loading conversations:", error);
        setNotification({
          show: true,
          message: "Erreur lors du chargement des conversations",
          type: 'error'
        });
        setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 3000);
      }
    };

    loadConversations();
  }, [currentUserId]);

  // Charger les messages pour la conversation active
  useEffect(() => {
    const loadMessages = async (conversation) => {
      if (!conversation) {
        console.warn("⚠️ No conversation provided to loadMessages");
        return;
      }

      try {
        console.log("🔄 Loading messages for conversation:", conversation);
        
        // Extract IDs from conversation
        const destinataireId = conversation.candidatId;
        const offreId = conversation.offreId;

        console.log("📤 Fetching messages with params:", {
          destinataireId,
          offreId,
          currentUserId
        });

        const messages = await fetchMessagesByConversation(destinataireId, offreId);
        
        if (!Array.isArray(messages)) {
          console.warn("⚠️ Received invalid messages format:", messages);
          return;
        }

        console.log("📨 Received messages:", messages);

        // Update only the messages for the active conversation
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv.id === activeConversationId) {
              return {
                ...conv,
                messages
              };
            }
            return conv;
          });
        });
      } catch (error) {
        console.error("❌ Error loading messages:", error);
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
      console.log("📝 Sending message:", {
        activeConversation,
        currentUserId,
        message: message.trim()
      });

      const messageData = {
        contenu: message.trim(),
        destinataire_id: activeConversation.candidatId, // Send to the professional
        offre_id: activeConversation.offreId,
        type_message: 'normal'
      };

      console.log("📤 Message data:", messageData);

      const sentMessage = await sendMessage(messageData);
      console.log("✅ Message envoyé:", sentMessage);

      // Reload messages
      const updatedMessages = await fetchMessagesByConversation(
        activeConversation.candidatId,
        activeConversation.offreId
      );

      if (Array.isArray(updatedMessages)) {
        setConversations(prev =>
          prev.map(c =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: updatedMessages,
                  lastMessage: updatedMessages[updatedMessages.length - 1]?.contenu || '',
                  lastMessageDate: updatedMessages[updatedMessages.length - 1]?.date_envoi || new Date().toISOString()
                }
              : c
          )
        );

        // Force scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      setMessage('');
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error);
      setNotification({
        show: true,
        message: "Erreur lors de l'envoi du message",
        type: 'error'
      });
    }
  };
  
  
    // Passer un message en mode édition
    const handleEditMessage = (msg) => {
      setEditingMessage(msg);
      setMessage(msg.contenu);
      setMessageActionsOpen(null);
    };
  
    // Supprimer un message existant
    const handleDeleteMessage = async (messageId) => {
      if (!window.confirm("Supprimer ce message ?")) return;
  
      try {
        await deleteMessage(messageId);
  
        const updatedMessages = await fetchMessagesByConversation(
          activeConversation.candidatId,
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
  
    // Annuler l'édition d'un message
    const handleCancelEdit = () => {
      setEditingMessage(null);
      setMessage('');
    };
  
    // Afficher ou cacher le menu d'actions pour un message donné
    const toggleMessageActions = (id) => {
      setMessageActionsOpen(prev => (prev === id ? null : id));
    };
  

  // Formater l'affichage des dates des messages
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

  // Filtrer les conversations selon la recherche clinique
  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await fetchClinicOffers();
        console.log("📦 Offres récupérées :", data);
        setClinicOffers(data);
      } catch (err) {
        console.error("❌ Erreur chargement des offres :", err);
      }
    };

    if (newMessageMode) {
      fetchOffers();
      setSelectedOfferId(null);
      setMessage('');
    }
  }, [newMessageMode]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await fetchApplicantsByOffer(selectedOfferId); 
        setApplicants(data);
      } catch (err) {
        console.error("Erreur chargement des candidats :", err);
      }
    };

    if (selectedOfferId) {
      fetchApplicants();
    } else {
      setApplicants([]);
    }
  }, [selectedOfferId]);

  const handleSendNewMessage = async (e) => {
    e.preventDefault();

    if (!selectedCandidateId || !message.trim()) return;

    try {
      // 📨 1. Envoi du message
      await sendMessage({
        contenu: message,
        offre_id: selectedOfferId,
        destinataire_id: selectedCandidateId,
        expediteur_id: currentUserId
      });

      // 🔄 2. Recharge les conversations
      const updatedConversations = await fetchConversations();
      setConversations(updatedConversations);

      // 🔍 3. Trouve la conversation correspondante (destinataire et offre)
      const newConv = updatedConversations.find(conv =>
        ((conv.destinataire_id === selectedCandidateId && conv.expediteur_id === currentUserId) ||
         (conv.destinataire_id === currentUserId && conv.expediteur_id === selectedCandidateId)) &&
        conv.id_offre === selectedOfferId
      );

      if (newConv) {
        setActiveConversationId(newConv.id);

        // 🧠 4. Charge les messages de cette conversation
        const messages = await fetchMessagesByConversation(newConv.id);
        setConversations(prev =>
          prev.map(c =>
            c.id === newConv.id
              ? {
                  ...c,
                  messages,
                  lastMessage: messages.at(-1)?.contenu || '',
                  lastMessageDate: messages.at(-1)?.date_envoi || ''
                }
              : c
          )
        );
      }

      // 🧼 5. Nettoyage
      setMessage('');
      setSelectedOfferId(null);
      setSelectedCandidateId(null);
      setNewMessageMode(false);

      setNotification({
        show: true,
        message: 'Message envoyé avec succès',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi du nouveau message :", err);
      setNotification({
        show: true,
        message: "Échec de l'envoi du message",
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 3000);
    }
  };

  return (
    <div className="clinique-messagerie-container">
      {/* Panneau des conversations */}
      <div className="conversations-panel">
        <div className="conversations-header">
          <h1>Messagerie</h1>
          {newMessageMode ? (
            <button className="cancel-new-message-button" onClick={() => setNewMessageMode(false)}>
              <i className="fas fa-arrow-left"></i>
              <span>Annuler</span>
            </button>
          ) : (
            <button className="new-message-button" onClick={() => setNewMessageMode(true)}>
              <i className="fas fa-pen"></i>
            </button>
          )}
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
                  setNewMessageMode(false);
                }}
              >
                <div className={`conversation-avatar ${conv.profession}`}>
                  {conv.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div className="conversation-info">
                  <div className="conversation-info-header">
                    <span className="conversation-name">{conv.name}</span>
                    <span className="conversation-time">{formatMessageDate(conv.lastMessageDate)}</span>
                  </div>

                  <div className="conversation-preview">
                    {conv.lastMessage.length > 40
                      ? conv.lastMessage.substring(0, 40) + '...'
                      : conv.lastMessage}
                    {conv.unreadCount > 0 && <div className="unread-badge"></div>}
                  </div>

                  {hasScheduledMeeting && (
                    <div className="badge-entretien-prevu">📅 Entretien prévu</div>
                  )}
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
          <div className="new-message-form">
            <div className="messages-header">
              <h2 className="new-message-title">Nouveau message</h2>
            </div>

            {/* Sélecteur d'offre */}
            <label htmlFor="offer-select">Offre :</label>
            <select
              value={selectedOfferId || ''}
              onChange={(e) => {
                const rawValue = e.target.value;
                if (!rawValue) return;

                const offerId = parseInt(rawValue);
                const offer = clinicOffers.find(o => o.id_offre === offerId);

                console.log("➡️ offerId sélectionné:", offerId);
                console.log("➡️ offer trouvé:", offer);

                if (!offer) {
                  console.warn("⚠️ Offre non trouvée !");
                  return;
                }

                setSelectedOfferId(offerId);
                setSelectedOffer(offer);
                setSelectedCandidateId(null);
              }}
            >
              <option value="">-- Sélectionner une offre --</option>
              {clinicOffers.map((offer) => (
                <option key={offer.id_offre} value={offer.id_offre}>
                  {offer.titre}
                </option>
              ))}
            </select>


            {/* Sélecteur de candidat */}
            {selectedOffer && (
              <>
                <label htmlFor="candidate-select">Candidat :</label>
                <select
                  value={selectedCandidateId || ''}
                  onChange={(e) => setSelectedCandidateId(parseInt(e.target.value))}
                >
                  <option value="">-- Sélectionner un candidat --</option>
                  {Array.isArray(applicants) &&
                    applicants.map(applicant => {
                      console.log("🧪 applicant brut :", applicant);
                      console.log("🔍 ProfessionnelDentaire :", applicant.ProfessionnelDentaire);
                      console.log("👤 User :", applicant.ProfessionnelDentaire?.User);

                      const user = applicant.ProfessionnelDentaire?.User;
                      const fullName = user ? `${user.prenom} ${user.nom}` : 'Inconnu';

                      return (
                        <option key={user?.id_utilisateur || applicant.id_professionnel} value={user?.id_utilisateur}>
                          {fullName}
                        </option>
                      );
                    })}



                </select>

              </>
            )}

            {/* Champ de message */}
            {selectedCandidateId && (
             <form className="message-input-container" onSubmit={handleSendNewMessage}>
             <div className="message-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
               <input
                 type="text"
                 className="message-input"
                 placeholder="Écrivez votre message..."
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 style={{ flex: 1 }}
               />
               <button
                 type="submit"
                 className="send-button"
                 disabled={!message.trim()}
                 style={{ marginLeft: '8px' }}
               >
                 <i className="fas fa-paper-plane"></i>
               </button>
             </div>
           </form>       
            )}
          </div>
        ) : activeConversation ? (
          <>
            <div className="messages-header">
              <div className="messages-header-info">
                <h3>{activeConversation?.name}</h3>
                <span className="profession">{activeConversation?.profession}</span>
              </div>
              <div className="messages-header-actions">
                {/* Remove the schedule button since we're not implementing that functionality */}
              </div>
            </div>

            <div className="offer-title-bar">
              {activeConversation.profession}
              {activeConversation.messages?.some(msg => msg.id_entretien) && (
                <span className="badge-entretien-inline">📅 Entretien prévu</span>
              )}
            </div>

            <div className="messages-content">
            {activeConversation?.messages?.map(msg => (

                <div
                  key={msg.id_message}
                  className={`message ${msg.expediteur_id === currentUserId ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    <div className="message-content">{msg.contenu}</div>
                    <div className="message-time">
                      {formatMessageDate(msg.date_envoi)}
                      {msg.est_lu === 'Y' && msg.expediteur_id === currentUserId && (
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
                        <button onClick={() => handleEditMessage(msg)}>
                          <i className="fas fa-edit"></i> Modifier
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id_message)}>
                          <i className="fas fa-trash"></i> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <form className="message-input-container" onSubmit={handleSendMessage}>
              <button type="button" className="input-action-button">
                <i className="fas fa-paperclip"></i>
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
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
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
                Sélectionnez une conversation ou créez un nouveau message.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i> {notification.message}
        </div>
      )}
    </div>
  );
}

export default CliniqueMessagerie;
