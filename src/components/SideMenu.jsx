import { Link } from "react-router-dom";
import LogoutButton from "./logout/LogoutButton";
import LoginButton from "./login/LoginButton"
import RegisterButton from "./register/RegisterButton";

// 노란색 : #F8C94A 
// 초록색: #1D9D8B 
// 갈색 : #A0522D
/**
 * #3E2C22 #1B5E56 #7C6004rgb(249, 244, 232) #F5E3D0
#e9f5f3
 */

const hoverColor = "#e9f5f3";
const iconColor = "#7C6004";


const SideMenu = ({ isOpen, onClose, appWidth,userInfo }) => {
  const { nickname, role, error, loading } = userInfo;
  const SIDEBAR_WIDTH = appWidth / 2;

  const getMenuItemsByRole = (role) => {
    console.log(role);
    
    const baseItems = [
      { label: "홈", href: "/", icon: "bi-house-door" },
      { label: "팝업 목록", href: "/popup/list", icon: "bi-shop" },
      { label: "예약 내역", href: "/reservation/list", icon: "bi-calendar-check" },
      { label: "마이페이지", href: "/mypage", icon: "bi-person-circle" },
    ];

    const popupAdminItems = [
      { label: "통계 (사장님)", href: "/chart/data", icon: "bi-bar-chart" },
      { label: "QR 스캔 (사장님)", href: "/qr-scan", icon: "bi-qr-code-scan" },
      { label: "공지 작성 (사장님)", href: "/mypage/register-noti", icon: "bi-qr-code-scan" },
    ];

    const superAdminItems = [
      { label: "통계 (총괄 관리자)", href: "/admin/popup/list", icon: "bi-graph-up" },
    ];

    if (role === "ROLE_POPUP_ADMIN") {
      return [...baseItems, ...popupAdminItems];
    } else if (role === "ROLE_ADMIN") {
      return [...baseItems, ...popupAdminItems, ...superAdminItems];
    } else {
      return baseItems;
    }
  };

  const menuItems = getMenuItemsByRole(role);

  if (!isOpen) return null;
  return (
    <div
      className="position-fixed border-start d-flex flex-column justify-content-between"
      style={{
        top: 0,
        right: `calc((100vw - ${appWidth}px) / 2)`,
        width: `${SIDEBAR_WIDTH}px`,
        height: "100vh",
        zIndex: 1050,
        backgroundColor: "#f8f9fa",
        boxShadow: "-1px 0 5px rgba(0,0,0,0.05)",
        borderRadius: "30px 0 0 30px"
      }}
    >
      <div>
        <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
          <div className="d-flex align-items-center">
            <small className="text-muted">SideMenu</small>
          </div>
          <button className="btn p-0" onClick={onClose}>
            <i className="bi bi-x-lg fs-5 text-dark"></i>
          </button>
        </div>

        <ul className="list-group list-group-flush">
          {menuItems.map(({ label, href, icon }, idx) => (
            <li key={idx} className="list-group-item px-3 py-2 border-0 bg-transparent">
              <Link
                to={href}
                onClick={onClose}
                className="d-flex align-items-center text-decoration-none text-dark rounded px-2 py-2 hover-bg"
                style={{ transition: "background-color 0.2s" }}
              >
                <i className={`bi ${icon} me-3 fs-6`} style={{ color: iconColor }}></i>
                <span className="fw-semibold" style={{ fontSize: '15px' }}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-3 pb-4 d-flex justify-content-center" >
        {role ? (
          <LogoutButton />
        ) : (
          <div className="d-flex justify-content-center w-100">
            <LoginButton />
            <RegisterButton />
          </div>
        )}
      </div>

      <style>
        {`
          .hover-bg:hover {
            background-color: ${hoverColor};
            color: black !important;
          }
        `}
      </style>
    </div>
  );
};

export default SideMenu;