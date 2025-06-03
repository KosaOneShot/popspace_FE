// src/components/Header.jsx
import React from "react";

const Header = () => {
  const HEADER_HEIGHT = 56; // px

  return (
    <>
      <header
        className="fixed-top start-50 translate-middle-x w-100 bg-white border-bottom d-flex align-items-center px-3"
        style={{ maxWidth: "390px", height: `${HEADER_HEIGHT}px`, zIndex: 1000 }}
      >
        {/* 왼쪽 로고 영역 */}
        <a href="/" className="d-flex align-items-center text-decoration-none">
          <i className="bi bi-rocket-takeoff-fill fs-4 me-2 text-dark"></i>
          <span className="fw-bold text-dark fs-5 m-0">POP-SPACE</span>
        </a>

        {/* 우측 햄버거 버튼 */}
        <button
          className="btn p-0 ms-auto"
          style={{ width: "24px", height: "24px" }}
          aria-label="메뉴"
        >
          <i className="bi bi-list fs-3 text-dark"></i>
        </button>
      </header>

      {/* 스크롤 시 콘텐츠가 헤더 아래에서 시작되도록 동일 높이만큼 빈 공간 추가 */}
      <div style={{ height: `${HEADER_HEIGHT}px` }} />
    </>
  );
};

export default Header;