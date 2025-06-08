import React, { useState, useEffect } from "react";
import axi from "../utils/axios/Axios";
import {axiUpdatePopupLike} from './popupAxios';
/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = ({ popupId, memberId }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Optional: 초기 찜 상태 불러올 로직이 필요하면 여기에 작성
  }, []);

  // 찜 버튼 클릭 시 호출되는 함수
  const handleLikeToggle = async () => {
    try {
      const resLiked = await axiUpdatePopupLike(1, !isLiked);
      setIsLiked(resLiked);
    } catch (err) {
      console.error(err);
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
        className="btn btn-outline-danger ms-2 d-flex justify-content-center align-items-center"
        style={{
          borderRadius: "8px",
          width: "40px",
          height: "80%",
          padding: 0,
        }}
        onClick={handleLikeToggle}
      >
        <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`} style={{ fontSize: "1.2rem" }} />
      </button>
    </div>
  );
};

export default FooterButtons;