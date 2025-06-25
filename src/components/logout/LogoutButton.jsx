import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axi from '../../utils/axios/Axios';
import './LogoutButton.css';
import LogoutModal from './LogoutModal';

const LogoutButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await axi.post('/api/auth/logout');
      // 모달부터 띄우고
      setShowModal(true);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/');
    window.location.reload(); // 모달 닫힐 때 새로고침
  };

  return (
    <>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
      <LogoutModal show={showModal} onClose={handleModalClose} />
    </>
  );
};

export default LogoutButton;