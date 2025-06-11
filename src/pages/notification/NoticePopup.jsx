import Cookies from "js-cookie";
import { useState } from "react";
import styles from "./NoticePopup.module.css";

const NoticePopup = ({ notifyId, title, content, imageUrl, onClose }) => {
  const [hideToday, setHideToday] = useState(false);

  const handleClose = () => {
    if (hideToday) {
      const expire = new Date();
      expire.setHours(23, 59, 59, 999);
      Cookies.set(`hidePopup_${notifyId}`, "true", { expires: expire });
    }
    onClose();
  };

  return (
    <div className={styles.noticePopup}>
      <div className={styles.popupHeader}>
        <span className={styles.popupTitle}>[{title}]</span>
        <button className={styles.popupClose} onClick={handleClose}>
          ×
        </button>
      </div>

      <hr className={styles.popupDivider} />

      {imageUrl && (
        <img src={imageUrl} alt="공지 이미지" className={styles.popupImage} />
      )}

      <div className={styles.popupContent}>
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className={styles.popupFooter}>
        <label className={styles.popupCheckbox}>
          <input
            type="checkbox"
            className="form-check-input"
            id={`hideCheck_${notifyId}`}
            checked={hideToday}
            onChange={(e) => setHideToday(e.target.checked)}
          />
          오늘 하루동안 보지 않기
        </label>

        <button className={styles.popupBtn} onClick={handleClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default NoticePopup;
