import { useNavigate } from "react-router-dom";

function TeamMember({ image, alt, index, link }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      className={`team-member team-member-${index + 1}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }} // Ajoute un curseur interactif
    >
      <img src={image} alt={alt} />
    </div>
  );
}

export default TeamMember;
