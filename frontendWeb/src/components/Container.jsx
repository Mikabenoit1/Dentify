import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SignIn from "./Login/SignIn";
import SignUp from "./Login/SignUp";
import Overlay from "./Login/Overlay";
import "../styles/Container.css";

function Container() {
  const location = useLocation();
  const [isRightPanelActive, setRightPanelActive] = useState(false); // Par défaut: connexion
  const [isClinic, setIsClinic] = useState(false); // false = Professionnel, true = Clinique

  // Utiliser l'état dans l'URL pour déterminer quel panel afficher
  useEffect(() => {
    // Vérifier si on doit afficher l'inscription (signup)
    if (location.state && location.state.showSignUp) {
      setRightPanelActive(true);
    } else {
      setRightPanelActive(false);
    }
  }, [location]);

  return (
    <div className="page-wrapper">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        <h2>{isClinic ? "Connexion / Inscription pour Cliniques" : "Connexion / Inscription pour Professionnels"}</h2>

        {/* Affichage dynamique des formulaires */}
        {isClinic ? <SignIn type="clinique" /> : <SignIn type="professionnel" />}
        {isClinic ? <SignUp type="clinique" /> : <SignUp type="professionnel" />}

        <Overlay setRightPanelActive={setRightPanelActive} />
      </div>

      {/* Bouton placé en dehors du container */}
      <div className="toggle-role-container">
        <button className="toggle-role-btn" onClick={() => setIsClinic(!isClinic)}>
          {isClinic ? "Passer en mode Professionnel" : "Passer en mode Clinique"}
        </button>
      </div>
    </div>
  );
}

export default Container;