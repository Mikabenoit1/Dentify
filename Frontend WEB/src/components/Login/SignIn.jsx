import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";

function SignIn({ type }) {
  return (
    <div className="form-container sign-in-container">
      <form action="#">
        <h1>{type === "clinique" ? "Connexion Clinique" : "Connexion Professionnel"}</h1>
        <div className="social-container">
          <a href="#" className="social"><FaFacebookF /></a>
          <a href="#" className="social"><FaGooglePlusG /></a>
          <a href="#" className="social"><FaLinkedinIn /></a>
        </div>
        <span>ou utilisez votre compte</span>
        <input type="email" placeholder="Courriel" />
        <input type="password" placeholder="Mot de passe" />
        <a href="#">Mot de passe oublié?</a>
        <button>Connexion</button>
      </form>
    </div>
  );
}

export default SignIn;
