function Overlay({ setRightPanelActive }) {
  return (
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>Bienvenue!</h1>
          <p>Connectez-vous pour continuer</p>
          <button class="ghost" onClick={() => setRightPanelActive(false)}>
            Connectez-vous
          </button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Bonjour, ami!</h1>
          <p>Créez un compte pour rejoindre notre communauté</p>
          <button class="ghost" onClick={() => setRightPanelActive(true)}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overlay;
