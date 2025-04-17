// src/components/SimpleChatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/SimpleChatbot.css';
import responses from './chatbotResponses';

const SimpleChatbot = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Liste des pages où le chatbot DOIT apparaître (uniquement pages professionnelles)
  const allowedPaths = [
    "/principale",
    "/mon-compte", 
    "/offres",
    "/applique",
    "/calendrier",
    "/messagerie"
  ];
  
  // Vérifier si nous sommes sur une page autorisée
  const isAllowedPath = allowedPaths.some(path => currentPath === path || 
                                               (path === "/messagerie" && currentPath.startsWith("/messagerie/")));
  
  // Si nous ne sommes pas sur une page autorisée, ne pas rendre le chatbot
  if (!isAllowedPath) {
    return null;
  }
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour! Comment puis-je vous aider aujourd'hui?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fermer le chat si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fonction pour obtenir une réponse basée sur l'entrée utilisateur
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Parcourir toutes les catégories de réponses
    for (const category in responses) {
      // Ignorer la réponse par défaut
      if (category === 'default') continue;
      
      // Vérifier si l'entrée contient un des mots-clés
      if (category.endsWith('_keywords')) {
        const baseCategory = category.replace('_keywords', '');
        const keywords = responses[category];
        
        // Si un mot-clé est trouvé, retourner la réponse correspondante
        if (keywords.some(keyword => input.includes(keyword))) {
          return responses[baseCategory];
        }
      }
    }
    
    // Si aucune correspondance n'est trouvée, retourner la réponse par défaut
    return responses.default;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simuler un délai de réponse (plus naturel)
    setTimeout(() => {
      const botResponse = getResponse(input);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponse, isUser: false }
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="chatbot-widget" ref={chatRef}>
      {/* Icône flottante pour ouvrir le chat */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`} 
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
      
      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h2>Assistant</h2>
            <button className="close-btn" onClick={toggleChat}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                {message.text}
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot-message typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SimpleChatbot;