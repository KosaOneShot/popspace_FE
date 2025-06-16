// src/popup/PopupDetailFooter.jsx
import React, { useState, useEffect } from "react";
import { axiUpdatePopupLike } from "./popupAxios";
// src/popup/PopupDetailFooter.jsx

/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = ({ popupId, like, isLogined }) => {
  const [isLiked, setIsLiked] = useState(like);

  // 부모에서 like prop이 바뀌면 동기화
  useEffect(() => {
    setIsLiked(like);
  }, [like]);

  // 찜 버튼 클릭 시 호출되는 함수
  const handleLikeToggle = async () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      await axiUpdatePopupLike(popupId, next);
    } catch (err) {
      console.error("찜 상태 업데이트 실패:", err);
      setIsLiked(prev => !prev);
    }
  };

  return (
    <div
      className="position-fixed"
      style={{
        bottom: "75px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "390px",
        height: "70px",
        zIndex: 1000,
        backgroundColor: "#F7F6F3",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        padding: "4px",
      }}
    >
    {/* 사전예약 버튼 */}
    <button
      type="button"
      disabled={!isLogined}
      className="btn me-2"
      style={{
        width: "43%",
        borderRadius: "8px",
        height: "80%",
        backgroundColor: isLogined ? "#DB9506" : "#ccc",
        color: isLogined ? "#fff" : "#666"
      }}
    >
      사전 예약
    </button>

    {/* 웨이팅 버튼 */}
    <button
      type="button"
      disabled={!isLogined}
      className="btn"
      style={{
        width: "43%",
        borderRadius: "8px",
        height: "80%",
        backgroundColor: isLogined ? "#1D9D8B" : "#ccc",
        color: isLogined ? "#fff" : "#666"
      }}
    >
      현장 웨이팅
    </button>

    {/* 찜하기 버튼 */}
    <button
      type="button"
      disabled={!isLogined}
      className={`btn ms-2 d-flex justify-content-center align-items-center ${
        isLogined
          ? isLiked
            ? "btn-danger"
            : "btn-outline-danger"
          : "btn-secondary"
      }`}
      style={{
        borderRadius: "8px",
        width: "40px",
        height: "80%",
        padding: 0,
        pointerEvents: isLogined ? "auto" : "none"
      }}
      onClick={handleLikeToggle}
    >
      <i
        className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
        style={{
          fontSize: "1.2rem",
          color: isLogined ? undefined : "#666"
        }}
      />
    </button>
    </div>
  );
};

export default FooterButtons;