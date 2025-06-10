// src/popup/PopupDetailFooter.jsx
import React, { useState, useEffect } from "react";
import { axiUpdatePopupLike } from "./popupAxios";

/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = ({ popupId, like, reservation }) => {
  const [isLiked, setIsLiked] = useState(like);

  // 부모에서 like prop이 바뀌면 동기화
  useEffect(() => {
    setIsLiked(like);
  }, [like]);

  // 찜 버튼 클릭 시 호출되는 함수
  const handleLikeToggle = async () => {
    // UI를 먼저 토글
    const next = !isLiked;
    setIsLiked(next);

    try {
      // 서버에도 변경 요청
      await axiUpdatePopupLike(popupId, next);
    } catch (err) {
      console.error("찜 상태 업데이트 실패:", err);
      // 실패하면 UI 롤백
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
      {/* 예약하기 버튼 */}
      <button
        type="button"
        className="btn btn-success flex-grow-1"
        style={{
          borderRadius: "8px",
          height: "80%",
        }}
      >
        예약하기
      </button>

      {/* 찜하기 버튼 */}
      <button
        type="button"
        className={`btn ms-2 d-flex justify-content-center align-items-center ${
          isLiked ? "btn-danger" : "btn-outline-danger"
        }`}
        style={{
          borderRadius: "8px",
          width: "40px",
          height: "80%",
          padding: 0,
        }}
        onClick={handleLikeToggle}
      >
        <i
          className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
          style={{ fontSize: "1.2rem" }}
        />
      </button>
    </div>
  );
};

export default FooterButtons;