/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = () => (
  <div
    className="position-fixed"
    style={{
      bottom: "75px",                   // 화면 맨 아래에서 60px 위
      left: "50%",                      // 가로 중앙 기준
      transform: "translateX(-50%)",    // 정확히 가운데 정렬
      width: "390px",                   // 고정 너비
      height: "70px",                   // 고정 높이
      zIndex: 1000,
      backgroundColor: "#F7F6F3",       // 회색 배경
      borderRadius: "8px",              // 모서리 둥글게
      display: "flex",
      alignItems: "center",
      padding: "4px",                   // 상하 여백 4px씩 (총 8px), 버튼 높이 32px
    }}
  >
    {/* 예약하기 버튼: 내부 높이(32px) 채우도록 flex-grow */}
    <button
      type="button"
      className="btn btn-success flex-grow-1"
      style={{
        borderRadius: "8px",
        height: "80%",   // 부모(40px)에서 padding 제외된 32px 높이 채움
      }}
    >
      예약하기
    </button>

    {/* 찜하기 버튼: 고정 너비 40px, 동일 높이 */}
    <button
      type="button"
      className="btn btn-outline-danger ms-2 d-flex justify-content-center align-items-center"
      style={{
        borderRadius: "8px",
        width: "40px",
        height: "80%",
        padding: 0,
      }}
    >
      {/* TODO : 찜내역 DB에서 가져와서 빈하트 or 찬하트 뿌리기 조건식 */}
      <i className="bi bi-heart-fill" style={{ fontSize: "1.2rem" }} />
    </button>
  </div>
);

export default FooterButtons;