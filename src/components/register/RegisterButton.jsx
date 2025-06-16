import { useNavigate } from 'react-router-dom';
import './RegisterButton.css';

const RegisterButton = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/auth/register');
    window.location.reload(); // 사이드메뉴 새로고침
  };

  return (
    <button className="register-button" onClick={handleRegister}>
      회원가입
    </button>
  );
};

export default RegisterButton;