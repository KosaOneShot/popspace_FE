import { useNavigate } from 'react-router-dom';
import './LoginButton.css';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
    window.location.reload(); // 사이드메뉴 새로고침
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      로그인
    </button>
  );
};

export default LoginButton;