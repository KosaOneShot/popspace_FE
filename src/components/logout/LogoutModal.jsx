import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutModal.css';

export default function LogoutModal({ show, onClose }) {
  const navigate = useNavigate();

  if (!show) return null;

  const handleHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="lm-backdrop">
      <div className="lm-modal">
        <div className="lm-header">
          <h5 className="lm-title">로그아웃 되었습니다.</h5>
        </div>
        <div className="lm-footer">
          <button className="lm-button" onClick={handleHome}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}