import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./FavoritePopups.module.css";
import { useNavigate } from "react-router-dom";

const FavoriteCard = ({ popup, onToggle }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/popup/detail/${popup.popupId}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="row g-0">
        <div className="col-3">
          <img
            src={popup.imageUrl}
            alt={popup.title}
            className={styles.image}
          />
        </div>
        <div className="col-9">
          <div className="card-body py-2 px-3">
            <div className="d-flex justify-content-between align-items-start">
              <h5 className={styles.title}>{popup.title}</h5>
              <div
                className={styles.heartIcon}
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
                  onToggle();
                }}
              >
                {popup.liked ? (
                  <AiFillHeart color="#FDBA10" size={22} />
                ) : (
                  <AiOutlineHeart color="#ccc" size={22} />
                )}
              </div>
            </div>
            <p className={styles.date}>{popup.dateRange}</p>
            <p className={styles.location}>
              <i className="bi bi-geo-alt"></i> {popup.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
