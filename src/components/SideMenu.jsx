import { Link, useNavigate } from "react-router-dom";
import useUserInfo from "../hook/useUserInfo";
import LogoutButton from "./logout/LogoutButton";

const SideMenu = ({ isOpen, onClose, appWidth, onUserChange }) => {
  const userInfo = useUserInfo();
  const SIDEBAR_WIDTH = appWidth / 2;

  const menuItems = [
    { label: "홈", href: "/" },
    { label: "팝업 목록", href: "/popup/list" },
    { label: "예약 내역", href: "/reservation/list" },
    { label: "마이페이지", href: "/mypage" },
    { label: "통계 (사장님)", href: "/chart/data" },
    { label: "QR 스캔 (사장님)", href: "/qr-scan" },
    { label: "통계(총괄 관리자)", href: "/admin/popup/list" }
  ];

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
            <Link to={href} onClick={onClose} className="text-decoration-none text-dark d-block">
              {label}
            </Link>
          </li>
        ))}

        {userInfo?.role ? (
          <li className="list-group-item">
            <LogoutButton onLogout={onUserChange} />
          </li>
        ) : (
          <>
            <li className="list-group-item">
              <Link
                to="/auth/login"
                onClick={() => {
                  onClose();
                }}
                className="text-decoration-none text-dark d-block"
              >
                로그인
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/auth/register" onClick={onClose} className="text-decoration-none text-dark d-block">
                회원가입
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SideMenu;