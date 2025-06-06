import "./NoticePopup.css";
import Cookies from "js-cookie";
import { useState } from "react";

const NoticePopup = ({ notifyId, title, content, imageUrl, onClose }) => {
  // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  // const bind = useDrag(({ offset: [ox, oy] }) => {
  //   api.start({ x: ox, y: oy });
  // });
  const [hideToday, setHideToday] = useState(false);
  const handleClose = () => {
    if (hideToday) {
      // 오늘 하루 보지 않기 쿠키 저장 (24시간)
      const expire = new Date();
      expire.setHours(23, 59, 59, 999);
      Cookies.set(`hidePopup_${notifyId}`, "true", { expires: expire });
    }
    onClose();
  };

  return (
    // <animated.div
    //   {...bind()}
    //   style={{
    //     x,
    //     y,
    //     position: "fixed",
    //     zIndex: 1000,
    //     touchAction: "none",
    //   }}
    //   className="popup-container"
    // >
    <div className="notice-popup">
      <div className="popup-header">
        <span className="popup-title">[{title}]</span>
        <button className="popup-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <hr className="popup-divider" />
      {imageUrl && (
        <img src={imageUrl} alt="공지 이미지" className="popup-image" />
      )}
      <div className="popup-content">
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="popup-footer">
        <label className="popup-checkbox">
          <input
            type="checkbox"
            className="form-check-input"
            id={`hideCheck_${notifyId}`}
            checked={hideToday}
            onChange={(e) => setHideToday(e.target.checked)}
          />
          오늘 하루동안 보지 않기
        </label>
        <button className="popup-btn" onClick={handleClose}>
          닫기
        </button>
      </div>
    </div>
    // </animated.div>
  );
};

export default NoticePopup;
