// 📁 src/components/NoticePopup.js
import React from 'react';
import './NoticePopup.css'; // 스타일 별도 분리 추천

const NoticePopup = ({ title, content, onClose, onViewDetail, onHideToday }) => {
  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="popup-header">
          <span className="popup-icon">ℹ️</span>
          <span className="popup-title">{title}</span>
          <button className="popup-close" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">{content}</div>
        <div className="popup-actions">
          <button className="gray-button" onClick={onHideToday}>오늘 하루 보지 않기</button>
          <button className="black-button" onClick={onViewDetail}>상세 보기</button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
