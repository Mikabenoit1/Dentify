import { useNavigate } from 'react-router-dom'; 
import Container from "../components/Container";

function Login() {
  const navigate = useNavigate(); 

  const handleLogoClick = () => {
    navigate('/');  
  };

  return (
    <div>
      <img
        src="/assets/img/dentify_logo_noir.png"
        alt="DENTify Logo"
        className="logo_header"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <Container />
    </div>
  );
}

export default Login;