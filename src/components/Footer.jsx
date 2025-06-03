const Footer = () => {
  // 갈색 : 795548 초록색 : 1D9D8B 검정색 : 000000
  const items = [
    { label: "Home", href: "/", icon: "bi-house-fill", color: "#795548" },
    { label: "Popups", href: "/popups", icon: "bi-shop-window", color: "#1D9D8B" },
    { label: "예약 내역", href: "/reserve", icon: "bi-calendar-heart", color: "#795548" },
    { label: "mypage", href: "/mypage", icon: "bi-person-circle", color: "#795548" },
  ];

  return (
    <footer
      className="fixed-bottom start-50 translate-middle-x bg-white border-top"
      style={{
        width: "390px",       // iPhone 12 Pro 너비 기준
        zIndex: 1000,
      }}
    >
      <div className="d-flex justify-content-around align-items-center py-2">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className="d-flex flex-column align-items-center text-decoration-none"
            style={{ color: item.color }}
          >
            <i className={`${item.icon} fs-4`} />
            <small style={{ marginTop: "2px" }}>{item.label}</small>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;