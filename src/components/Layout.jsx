const Layout = ({ children }) => {
  return (
    <div
      style={{
        // position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0", // 화면 바깥 회색
        pointerEvents: "none", // 회색 영역 클릭 비활성
      }}
    >
      <div
        style={{
          width: "390px", // iPhone 12 Pro 고정 폭
          maxWidth: "100%", // 화면이 더 좁으면 꽉 채움
          height: "100%",
          minHeight: "780px",
          margin: "0 auto", // 가로 중앙 정렬
          backgroundColor: "#ffffff", // 앱 내부 흰색
          display: "flex",
          flexDirection: "column",
          pointerEvents: "auto", // 앱 영역은 클릭/스크롤 가능
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
