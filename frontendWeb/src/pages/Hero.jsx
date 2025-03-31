import { useNavigate } from "react-router-dom";
import TeamMember from "../components/Accueil/TeamMember";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();

  const teamMembers = [
    { 
      img: "/assets/img/infirmière_1.png", 
      alt: "Dental Professional in Green Scrubs",
      text: "Fonctionnalités",
      link: "/services"
    },
    { 
      img: "/assets/img/infirmière_2.png", 
      alt: "Dental Professional in White Coat",
      text: "Professions",
      link: "/professions"
    },
    { 
      img: "/assets/img/infirmière_3.png", 
      alt: "Dental Professional in Blue Scrubs",
      text: "Contact",
      link: "/contact"
    },
    { 
      img: "/assets/img/infirmière_4.png", 
      alt: "Dental Professional in White Coat",
      text: "À propos",
      link: "/propos"
    }
  ];

  return (
    <main className="hero">
      {/* Section Texte à gauche */}
      <div className="left-side">
        <h1>Simplifiez. Engagez. Remplacez.</h1>
        <p>Découvrez nos services et trouvez le professionnel de santé qui vous correspond.</p>
        <button className="cta-button" onClick={() => navigate("/services")}>
          Découvir
        </button>
      </div>

      {/* Section Personnages + Tache à droite */}
      <div className="right-side">
        <div className="background-splash">
          <img src="/assets/img/tachepistache.png" alt="Background Shape" />
        </div>
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <TeamMember 
              key={index}
              image={member.img}
              alt={member.alt}
              index={index}
              link={member.link}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Hero;
