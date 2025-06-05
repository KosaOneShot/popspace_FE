import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import "./NoticePopup.css";

const NoticePopup = ({ title, content, imageUrl, onClose, onHideToday }) => {
  // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  // const bind = useDrag(({ offset: [ox, oy] }) => {
  //   api.start({ x: ox, y: oy });
  // });

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
        <button className="popup-close" onClick={onClose}>
          ×
        </button>
      </div>
      <hr className="popup-divider" />
      {/* {imageUrl && (
        <img src={imageUrl} alt="공지 이미지" className="popup-image" />
      )} */}
      <div className="popup-content">
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="popup-footer">
        <label className="popup-checkbox">
          <input type="checkbox" onChange={onHideToday} /> 오늘 하루동안 보지
          않기
        </label>
        <button className="popup-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
    // </animated.div>
  );
};

export default NoticePopup;
