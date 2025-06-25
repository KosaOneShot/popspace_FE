import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  // defaultColor 는 비활성일 때, activeColor 는 현재 경로에 매칭될 때 사용할 색
  const defaultColor = "#000000";
  const activeColor  = "#8250DF";

  const items = [
    { label: "Home",        href: "/",                   icon: "bi-house-fill"       },
    { label: "Popups",      href: "/popup/list",         icon: "bi-shop-window"     },
    { label: "Reservations",   href: "/reservation/list",   icon: "bi-calendar-heart"  },
    { label: "Mypage",      href: "/mypage",             icon: "bi-person-circle"   },
  ];

  // 현재 경로의 첫번째 세그먼트를 뽑는 함수 ex) "/popup/list" -> "/popup"
  const getBasePath = href => {
    if (href === "/") return "/";
    return "/" + href.split("/")[1];
  };

  return (
    <footer
      className="fixed-bottom start-50 translate-middle-x bg-white border-top"
      style={{ width: "390px", zIndex: 1000 }}
    >
      <div className="d-flex justify-content-around align-items-center py-2">
        {items.map((item, idx) => {
          const base = getBasePath(item.href);
          const isActive = base === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(base);

          return (
            <Link
              key={idx}
              to={item.href}
              className="d-flex flex-column align-items-center text-decoration-none"
              style={{ color: isActive ? activeColor : defaultColor }}
            >
              <i className={`${item.icon} fs-4`} />
              <small style={{ marginTop: "2px" }}>{item.label}</small>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;