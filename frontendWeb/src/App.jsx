import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { OffersProvider } from "./components/OffersContext";
import CliniqueOffreDetail from './components/CliniqueOffreDetail';
import OfferCandidates from './components/OfferCandidates';
import Header from "./components/Header"; // Le Header original pour les pages publiques
import CliniqueHeader from "./components/CliniqueHeader"; // Header pour les pages clinique et pro
import Sidebar from "./components/Sidebar";
import SidebarPro from "./components/SidebarPro"; 
import SidebarCli from "./components/SidebarCli";
import SimpleChatbot from "./components/SimpleChatbot"; // Importer le chatbot
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Professions from "./pages/Professions";
import Propos from "./pages/Propos";
import PrincipaleClinique from "./pages/PrincipaleClinique";
import Principale from "./pages/Principale";
import CliniqueCree from "./pages/CliniqueCree";
import CliniqueOffre from "./pages/CliniqueOffre";
import CliniqueCalendrier from "./pages/CliniqueCalendrier";
import CliniqueMessagerie from "./pages/CliniqueMessagerie";
import MaClinique from "./pages/MaClinique";
import MonCompte from "./pages/MonCompte";
import Parametres from "./pages/Parametres"; // Importer la page Parametres
import Notifications from "./pages/Notifications"; // Importer la page Notifications
import ProfessionnelOffres from "./pages/ProfessionnelOffres";
import ProfessionnelApplique from "./pages/ProfessionnelApplique";
import ProfessionnelCalendrier from "./pages/ProfessionnelCalendrier";
import ProfessionnelMessagerie from "./pages/ProfessionnelMessagerie";
import "./styles/index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarProOpen, setSidebarProOpen] = useState(true);
  const [sidebarCliOpen, setSidebarCliOpen] = useState(true);
  const location = useLocation();
  
  // Routes spéciales
  const hideHeaderRoutes = [
    "/login", 
    "/principale", 
    "/principaleclinique", 
    "/clinique-cree", 
    "/clinique-offres",
    "/clinique-offres/", // Pour les détails d'une offre
    "/clinique-cree/", // Pour la modification d'offre
    "/clinique-calendrier",
    "/clinique-messagerie",
    "/clinique-profile",
    "/candidats/", // Pour la page des candidats
    "/pages/Connecte/Principale", 
    "/pages/Connecte/PrincipaleClinique",
    "/mon-compte",
    "/parametres", // Ajouter paramètres aux routes sans Header standard
    "/notifications", // Ajouter notifications aux routes sans Header standard
    "/offres",
    "/applique",
    "/calendrier",
    "/messagerie",
    "/messagerie/"
  ];
  
  // Routes où la Sidebar Pro doit apparaître
  const showSidebarProRoutes = [
    "/principale", 
    "/pages/Connecte/Principale",
    "/mon-compte",
    "/parametres", // Ajouter paramètres aux routes avec SidebarPro
    "/notifications", // Ajouter notifications aux routes avec SidebarPro
    "/offres",
    "/applique",
    "/calendrier",
    "/messagerie",
    "/messagerie/"
  ];
  
  // Routes où la Sidebar Clinique et CliniqueHeader doivent apparaître
  const cliniqueRoutes = [
    "/principaleclinique", 
    "/clinique-cree", 
    "/clinique-offres",
    "/clinique-offres/", 
    "/clinique-cree/", 
    "/clinique-calendrier",
    "/clinique-messagerie",
    "/clinique-profile",
    "/candidats/", 
    "/pages/Connecte/PrincipaleClinique",
    "/parametres", // Ajouter paramètres aux routes avec SidebarCli
    "/notifications" // Ajouter notifications aux routes avec SidebarCli
  ];

  // Routes spécifiques pour le chatbot (uniquement les pages pro, pas les pages clinique)
  const chatbotRoutes = [
    "/principale",
    "/mon-compte",
    "/parametres", // Ajouter paramètres aux routes avec chatbot
    "/notifications", // Ajouter notifications aux routes avec chatbot
    "/offres",
    "/applique",
    "/calendrier",
    "/messagerie"
  ];

  // Regrouper toutes les routes où CliniqueHeader doit apparaître (pro + clinique)
  const showCliniqueHeaderRoutes = [...showSidebarProRoutes, ...cliniqueRoutes];

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebarPro = () => setSidebarProOpen(true);
  const closeSidebarPro = () => setSidebarProOpen(false);
  const openSidebarCli = () => setSidebarCliOpen(true);
  const closeSidebarCli = () => setSidebarCliOpen(false);

  // Déterminer si nous sommes sur une route clinique
  const isCliniqueRoute = cliniqueRoutes.some(route => location.pathname.startsWith(route));
  
  // Déterminer si nous sommes sur une route pro
  const isProRoute = showSidebarProRoutes.some(route => location.pathname.startsWith(route));

  // Déterminer si nous devons afficher le CliniqueHeader
  const shouldShowCliniqueHeader = showCliniqueHeaderRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Déterminer si nous devons afficher le chatbot (uniquement sur les routes chatbotRoutes)
  const shouldShowChatbot = chatbotRoutes.some(route => location.pathname.startsWith(route));

  return (
    <OffersProvider>
      <div className="App">
        {/* Afficher le Header standard uniquement sur les pages publiques */}
        {!hideHeaderRoutes.some(route => location.pathname.startsWith(route)) && (
          <>
            <Header openSidebar={openSidebar} />
            <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
          </>
        )}
        
        {/* Afficher CliniqueHeader sur les routes clinique ET pro */}
        {shouldShowCliniqueHeader && <CliniqueHeader />}
        
        {/* Afficher SidebarPro uniquement sur les pages professionnelles */}
        {isProRoute && (
          <SidebarPro isOpen={sidebarProOpen} closeSidebar={closeSidebarPro} />
        )}

        {/* Afficher SidebarCli uniquement sur les pages cliniques */}
        {isCliniqueRoute && (
          <SidebarCli isOpen={sidebarCliOpen} closeSidebar={closeSidebarCli} />
        )}
    
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/professions" element={<Professions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/propos" element={<Propos />} />
          
          {/* Routes professionnelles */}
          <Route path="/principale" element={<Principale />} />
          <Route path="/mon-compte" element={<MonCompte />} />
          <Route path="/offres" element={<ProfessionnelOffres />} />
          <Route path="/applique" element={<ProfessionnelApplique />} />
          <Route path="/calendrier" element={<ProfessionnelCalendrier />} />
          <Route path="/messagerie" element={<ProfessionnelMessagerie />} />
          <Route path="/messagerie/:conversationId" element={<ProfessionnelMessagerie />} />
          
          {/* Routes clinique */}
          <Route path="/principaleclinique" element={<PrincipaleClinique />} />
          <Route path="/clinique-cree" element={<CliniqueCree />} />
          <Route path="/clinique-cree/:id" element={<CliniqueCree />} />
          <Route path="/clinique-offres" element={<CliniqueOffre />} />
          <Route path="/clinique-offres/:id" element={<CliniqueOffreDetail />} />
          <Route path="/candidats/:id" element={<OfferCandidates />} />
          <Route path="/clinique-calendrier" element={<CliniqueCalendrier />} />
          <Route path="/clinique-messagerie" element={<CliniqueMessagerie />} />
          <Route path="/clinique-messagerie/:conversationId" element={<CliniqueMessagerie />} />
          <Route path="/clinique-profile" element={<MaClinique />} />
          
          {/* Routes partagées entre professionnel et clinique */}
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Redirections */}
          <Route path="/pages/Connecte/Principale" element={<Navigate to="/principale" replace />} />
          <Route path="/pages/Connecte/PrincipaleClinique" element={<Navigate to="/principaleclinique" replace />} />
        </Routes>
        
        {/* Ajouter le chatbot UNIQUEMENT sur les pages chatbot spécifiques */}
        {shouldShowChatbot && <SimpleChatbot />}
      </div>
    </OffersProvider>
  );  
}

export default App;
