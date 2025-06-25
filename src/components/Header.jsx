import React, { useState } from "react";
import SideMenu from "./SideMenu";
import useUserInfo from "../hook/useUserInfo";

const Header = () => {
  const [open, setOpen] = useState(false);
  const userInfo = useUserInfo();
  const HEADER_HEIGHT = 56;
  const APP_WIDTH = 390;

  return (
    <>
      <header
        className="fixed-top start-50 translate-middle-x w-100 bg-white border-bottom d-flex align-items-center px-3"
        style={{ maxWidth: `${APP_WIDTH}px`, height: `${HEADER_HEIGHT}px`, zIndex: 1000 }}
      >
        <a href="/" className="d-flex align-items-center text-decoration-none">
          <i className="bi bi-rocket-takeoff-fill fs-4 me-2" style={{ color: "black" }}></i>
          <span className="fw-bold fs-5 " style={{ color: "black" }}>POP-SPACE</span>
        </a>

        <button
          className="btn p-0 ms-auto d-flex align-items-center justify-content-center"
          onClick={() => setOpen(true)}
          style={{ width: "1.75rem", height: "1.75rem" }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>
      </header>

      <SideMenu isOpen={open} onClose={() => setOpen(false)} appWidth={APP_WIDTH} userInfo={userInfo} />
    </>
  );
};

export default Header;