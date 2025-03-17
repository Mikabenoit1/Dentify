import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";

function SignUp({ type }) {
  return (
    <div className="form-container sign-up-container">
      <form action="#">
        <h1>{type === "clinique" ? "Inscription Clinique" : "Inscription Professionnel"}</h1>
        <div className="social-container">
          <a href="#" className="social"><FaFacebookF /></a>
          <a href="#" className="social"><FaGooglePlusG /></a>
          <a href="#" className="social"><FaLinkedinIn /></a>
        </div>
        <span>ou utilisez votre courriel pour vous inscrire</span>
        <input type="text" placeholder="Nom" />
        <input type="email" placeholder="Courriel" />
        <input type="password" placeholder="Mot de passe" />
        <button>Inscription</button>
      </form>
    </div>
  );
}

export default SignUp;
