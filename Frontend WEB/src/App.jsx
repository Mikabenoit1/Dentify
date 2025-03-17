import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
/*import Footer from "./components/Footer";*/
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Professions from "./pages/Professions";
import Propos from "./pages/Propos";
import "./styles/index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // Récupère l'URL actuelle
  const hideHeaderAndFooterRoutes = ["/login"]; // Liste des pages où cacher Header, Sidebar et Footer

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="App">
      {/* Afficher le Header et Sidebar seulement si on n'est pas sur la page de Login */}
      {!hideHeaderAndFooterRoutes.includes(location.pathname) && (
        <>
          <Header openSidebar={openSidebar} />
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        </>
      )}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/professions" element={<Professions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/propos" element={<Propos />} />
      </Routes>

      {/* Afficher le Footer seulement si on n'est pas sur la page de Login */}
      {/*!hideHeaderAndFooterRoutes.includes(location.pathname) && <Footer />*/}
    </div>
  );
}

export default App;
