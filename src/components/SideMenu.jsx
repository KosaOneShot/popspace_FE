const menuItems = [
  { label: "홈", href: "/" },
  { label: "팝업 목록", href: "/popups" },
  { label: "예약 내역", href: "/reservations" },
  { label: "마이페이지", href: "/mypage" },
  { label: "통계 (사장님)", href: "/stats" },
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