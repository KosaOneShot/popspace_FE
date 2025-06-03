const menuItems = [
  { label: "내 정보", href: "/profile" },
  { label: "팝업 목록", href: "/popups" },
  { label: "팝업 예약 목록", href: "/reservations" },
  { label: "공지 등록", href: "/notice" },
  { label: "통계 보기", href: "/stats" },
  { label: "웨이팅 시간", href: "/waiting" },
];

const SideMenu = ({ isOpen, onClose, appWidth }) => {
  const SIDEBAR_WIDTH = appWidth / 2;

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed bg-white border-start"
      style={{
        top: 0,
        right: `calc((100vw - ${appWidth}px) / 2)`,
        width: `${SIDEBAR_WIDTH}px`,
        height: "100vh",
        zIndex: 1050,
      }}
    >
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <h5 className="m-0">메뉴</h5>
        <button className="btn p-0" onClick={onClose} aria-label="Close">
          <i className="bi bi-x fs-4"></i>
        </button>
      </div>
      <ul className="list-group list-group-flush">
        {menuItems.map(({ label, href }, idx) => (
          <li key={idx} className="list-group-item">
            <a href={href} className="text-decoration-none text-dark d-block">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;