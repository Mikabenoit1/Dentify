import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import pour la redirection
import { apiFetch } from "../../lib/apiFetch";

function SignUp({ type }) {
  const navigate = useNavigate(); // Hook pour la navigation
  const [formData, setFormData] = useState({
    nom: "",
    courriel: "",
    mot_de_passe: "",
    type_utilisateur: type === "clinique" ? "clinique" : "professionnel",
    adresse: "",
    ville: "",
    province: "",
    code_postal: ""
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Met à jour le type d'utilisateur si la prop change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type_utilisateur: type === "clinique" ? "clinique" : "professionnel"
    }));
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Envoi des données d'inscription :", formData); // Debug

    try {
      const response = await apiFetch("/users/register", {
        method: "POST",
        body: formData
      });

      console.log("Inscription réussie :", response);

      // 🔹 Redirection selon le type d'utilisateur
      if (formData.type_utilisateur === "clinique") {
        navigate("/pages/Connecte/PrincipaleClinique");
      } else {
        navigate("/pages/Connecte/Principale");
      }

    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setError(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>{type === "clinique" ? "Inscription Clinique" : "Inscription Professionnel"}</h1>
        
        <div className="social-container">
          <a href="#" className="social"><FaFacebookF /></a>
          <a href="#" className="social"><FaGooglePlusG /></a>
          <a href="#" className="social"><FaLinkedinIn /></a>
        </div>

        <span>ou utilisez votre courriel pour vous inscrire</span>

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="courriel"
          placeholder="Courriel"
          value={formData.courriel}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="mot_de_passe"
          placeholder="Mot de passe"
          value={formData.mot_de_passe}
          onChange={handleChange}
          required
          minLength="6"
        />

        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Inscription en cours..." : "Inscription"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
