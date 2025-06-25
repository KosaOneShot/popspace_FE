// Layout.jsx
import React from "react";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh", // 100vh 대신 min-height 사용
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0", // 바깥 회색
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "390px", // iPhone 12 Pro 폭
          maxWidth: "100%",
          height: "100%",
          margin: "0 auto", // 가로 중앙
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          pointerEvents: "auto",
          overflow: "hidden", // 외각 스크롤 제거
        }}
      >
        {/* 자식 영역만 스크롤 가능하게 */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "5rem" }}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
