import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ScheduleMeeting from '../components/ScheduleMeeting';
import { useOffers } from '../components/OffersContext';
import {
  fetchConversations,
  fetchMessagesByConversation,
  sendMessage,
  deleteMessage,
  updateMessage,
  markAsRead
} from '../lib/messageApi';
import { fetchClinicProfile, fetchClinicOffers, fetchApplicantsByOffer } from '../lib/clinicApi';
import '../styles/CliniqueMessagerie.css';

function CliniqueMessagerie() {
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
  const [clinicOffers, setClinicOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const { offers } = useOffers();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  



  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Charger le profil de la clinique connectée
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await fetchClinicProfile();
        setCurrentUserId(profile.id_utilisateur || profile.id);
      } catch (err) {
        console.error("Erreur lors du chargement du profil clinique :", err);
      }
    };
    loadCurrentUser();
  }, []);

  // Charger les conversations disponibles
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        console.log("📨 Conversations rechargées :", data); // conversations côté clinique
        setConversations(data);

        if (conversationId) {
          setActiveConversationId(parseInt(conversationId));
        } else if (data.length > 0) {
          setActiveConversationId(data[0].id);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des conversations :", err);
      }
    };
    loadConversations();
  }, [conversationId]);

  // Charger les messages pour la conversation active
  useEffect(() => {
    if (!activeConversationId || !currentUserId) return;
  
    const loadMessages = async () => {
      const conv = conversations.find(c => c.id === activeConversationId);
      if (!conv) return;
  
      const messages = await fetchMessagesByConversation(conv.candidatId, conv.offreId);
  
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? {
                ...c,
                messages,
                lastMessage: messages.at(-1)?.contenu || '',
                lastMessageDate: messages.at(-1)?.date_envoi || ''
              }
            : c
        )
      );
    };
  
    loadMessages();
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
      console.warn("⛔ Message vide ou conversation inactive");
      return;
    }
  
    try {
      if (editingMessage) {
        console.log("✏️ Mise à jour du message :", editingMessage.id);
        await updateMessage(editingMessage.id, message);
      } else {
        console.log("📤 Envoi d'un nouveau message...");
        await sendMessage({
          contenu: message,
          offre_id: activeConversation.offreId,
          destinataire_id: activeConversation.candidatId
        });
      }
  
      console.log("🔁 Rechargement des messages...");
      const updatedMessages = await fetchMessagesByConversation(
        activeConversation.candidatId,
        activeConversation.offreId
      );
      console.log("📨 Messages reçus :", updatedMessages);
  
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
      console.log("✅ Conversations mises à jour");
  
      setMessage('');
      setEditingMessage(null);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      console.log("⬇️ Scroll automatique effectué");
  
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi ou de l'édition du message :", error);
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
  
    // Ouvrir la modale de planification d’entretien
    const handleOpenScheduleModal = () => {
      setIsScheduleModalOpen(true);
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
    conv.candidatName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.offreTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la planification d’un entretien
const handleScheduleMeeting = (meetingData) => {
  // Créer un message de confirmation dans la conversation
  const meetingDate = new Date(meetingData.date);
  const formattedDate = `${meetingDate.toLocaleDateString()} à ${meetingData.startTime}`;
  const content = `📅 Un entretien a été planifié pour le ${formattedDate}.\n${meetingData.notes || ''}`;

  const newMessage = {
    id: Date.now(),
    senderId: 'clinic',
    senderName: 'Votre Clinique',
    content: content.trim(),
    timestamp: new Date().toISOString(),
    read: true,
    isMeetingMessage: true,
    id_entretien: meetingData.id_entretien || null
  };

  setConversations(prev =>
    prev.map(c =>
      c.id === activeConversationId
        ? {
            ...c,
            lastMessage: newMessage.content.split('\n')[0],
            lastMessageDate: newMessage.timestamp,
            messages: [...c.messages, newMessage]
          }
        : c
    )
  );

  setNotification({ show: true, message: 'Entretien planifié avec succès', type: 'success' });
  setTimeout(() => {
    setNotification({ show: false, message: '', type: 'success' });
  }, 3000);
};

useEffect(() => {
  const fetchOffers = async () => {
    try {
      const data = await fetchClinicOffers(); // 👈 dans clinicApi.js
      console.log("📦 Offres récupérées :", data);
      setClinicOffers(data);
    } catch (err) {
      console.error("❌ Erreur chargement des offres :", err);
    }
  };

  if (newMessageMode) {
    fetchOffers();
    setSelectedOfferId(null);
    setSelectedApplicant(null);
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

    // 🔍 3. Trouve la nouvelle conversation correspondante
    const newConv = updatedConversations.find(conv =>
      (conv.destinataire_id === selectedCandidateId || conv.expediteur_id === selectedCandidateId) &&
      conv.id_offre === selectedOfferId
    );

    if (newConv) {
      // ✅ 4. Recharge les messages de cette conversation
      const messages = await fetchMessagesByConversation(selectedCandidateId, selectedOfferId);

      // 🧠 5. Mets à jour la conversation avec les messages
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

      // 🎯 6. Affiche cette conversation immédiatement
      setActiveConversationId(newConv.id);
    }

    // 🧼 7. Nettoyage des champs
    setMessage('');
    setSelectedOfferId(null);
    setSelectedCandidateId(null);
    setNewMessageMode(false);

    // ✅ 8. Notification de succès
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
      message: 'Échec de l’envoi du message',
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
            <i className="fa-solid fa-arrow-left"></i>
            <span>Annuler</span>
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
              <div className={`conversation-avatar ${conv.candidatProfession}`}>
                {conv.candidatName?.charAt(0)?.toUpperCase() || '?'}
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
             <i className="fa-solid fa-paper-plane"></i>
           </button>
         </div>
       </form>       
          )}
        </div>
      ) : activeConversation ? (
        <>
          <div className="messages-header">
            <div className="contact-display">
              <div className={`contact-avatar ${activeConversation.candidatProfession}`}>
                {activeConversation.candidatName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <h3 className="contact-name-header">{activeConversation.candidatName}</h3>
            </div>

            <div className="messages-header-actions">
              <button className="schedule-button" onClick={handleOpenScheduleModal}>
                <i className="fa-solid fa-calendar-check"></i>
                <span>Planifier</span>
              </button>
            </div>
          </div>

          <div className="offer-title-bar">
            {activeConversation.offerTitle}
            {activeConversation.messages?.some(msg => msg.id_entretien) && (
              <span className="badge-entretien-inline">📅 Entretien prévu</span>
            )}
          </div>

          <div className="messages-content">
          {activeConversation?.messages?.map(msg => (

              <div
                key={msg.id}
                className={`message ${msg.expediteur_id === currentUserId ? 'sent' : 'received'} ${msg.isMeetingMessage ? 'meeting-message' : ''} ${msg.isCancellationMessage ? 'cancellation-message' : ''}`}
              >
                <div className="message-bubble">
                  {msg.content}
                  {msg.edited && <span className="message-edited">(modifié)</span>}
                  <div className="message-time">{formatMessageDate(msg.timestamp)}</div>

                  {msg.expediteur_id === currentUserId && !msg.isMeetingMessage && !msg.isCancellationMessage && (
  <button className="message-options-button" onClick={(e) => {
    e.stopPropagation();
    toggleMessageActions(msg.id);
  }}>
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

          {/* Zone de saisie */}
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
              Sélectionnez une conversation ou créez un nouveau message.
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
}
export default CliniqueMessagerie;
