// src/popup/PopupDetailFooter.jsx
import React, { useState, useEffect } from "react";
import { axiUpdatePopupLike } from "./popupAxios";
// src/popup/PopupDetailFooter.jsx

/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = ({ popupId, like }) => {
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
      className="btn me-2"
      style={{
        width: "43%",
        borderRadius: "8px",
        height: "80%",
        backgroundColor: "#DB9506",
        color: "#fff"
      }}
    >
      사전 예약
    </button>

    {/* 웨이팅 버튼 */}
    <button
      type="button"
      className="btn"
      style={{
        width: "43%",
        borderRadius: "8px",
        height: "80%",
        backgroundColor: "#1D9D8B",
        color: "#fff"
      }}
    >
      현장 웨이팅
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