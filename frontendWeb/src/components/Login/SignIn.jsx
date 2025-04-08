import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../lib/api";

function SignIn({ type }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    courriel: "",
    mot_de_passe: "",
    type_utilisateur: type
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Tentative de connexion avec:", credentials);

    try {
      const data = await loginUser(credentials);
    
      localStorage.setItem("token", data.token);
      console.log("Connexion réussie. Token:", data.token);
    
      if (credentials.type_utilisateur === "clinique") {
        navigate("/pages/Connecte/PrincipaleClinique");
      } else {
        navigate("/pages/Connecte/Principale");
      }
    
    } catch (error) {
      console.error("Erreur complète:", error);
      setError(error.message || "Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
      type_utilisateur: type
    }));
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>{type === "clinique" ? "Connexion Clinique" : "Connexion Professionnel"}</h1>

        <div className="social-container">
          <a href="#" className="social"><FaFacebookF /></a>
          <a href="#" className="social"><FaGooglePlusG /></a>
          <a href="#" className="social"><FaLinkedinIn /></a>
        </div>

        <span>ou utilisez votre compte</span>

        <input
          type="email"
          name="courriel"
          placeholder="Courriel"
          value={credentials.courriel}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="mot_de_passe"
          placeholder="Mot de passe"
          value={credentials.mot_de_passe}
          onChange={handleChange}
          required
          minLength="6"
        />

        {error && (
          <p className="error-message" style={{ color: "red", margin: "10px 0" }}>
            {error}
          </p>
        )}

        <a href="#" style={{ fontSize: "12px", margin: "10px 0" }}>
          Mot de passe oublié?
        </a>

        <button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: isLoading ? "#cccccc" : "" }}
        >
          {isLoading ? "Connexion en cours..." : "Connexion"}
        </button>
      </form>
    </div>
  );
}

export default SignIn;
