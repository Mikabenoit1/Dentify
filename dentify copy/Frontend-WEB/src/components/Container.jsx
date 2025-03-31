import { useState } from "react";
import SignIn from "./Login/SignIn";
import SignUp from "./Login/SignUp";
import Overlay from "./Login/Overlay";
import "../styles/container.css";

function Container() {
  const [isRightPanelActive, setRightPanelActive] = useState(true); // Affiche Inscription par défaut
  const [isClinic, setIsClinic] = useState(false); // false = Professionnel, true = Clinique

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
