import { useNavigate } from 'react-router-dom';
import axi from '../../utils/axios/Axios';
import { useAuth } from '../context/AuthContext';
import './LogoutButton.css';


const LogoutButton = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axi.post('/auth/logout');
      setAuth({
        role: null,
        userNickname: null, 
      });
      alert('로그아웃 되었습니다.');
      navigate('/main');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
