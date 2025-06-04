import React, { useRef, useEffect, useState } from "react";
import "./NoticePopup.css";

const NoticePopup = ({ title, content, imageUrl, onClose, onHideToday }) => {
  return (
    <div className="notice-popup">
      <div className="popup-header">
        <span className="popup-title">[{title}]</span>
        <button className="popup-close" onClick={onClose}>
          ×
        </button>
      </div>
      <hr className="popup-divider" />
      {/* {imageUrl && (
        <img src={imageUrl} alt="공지 이미지" className="popup-image" />
      )} */}
      <div className="popup-content">
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="popup-footer">
        <label className="popup-checkbox">
          <input type="checkbox" onChange={onHideToday} /> 오늘 하루동안 보지
          않기
        </label>
        <button className="popup-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default NoticePopup;
