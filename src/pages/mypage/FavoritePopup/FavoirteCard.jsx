import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./FavoritePopups.module.css";

const FavoriteCard = ({ popup, onToggle }) => (
  <div className={styles.card}>
    <div className="row g-0">
      <div className="col-3">
        <img src={popup.imageUrl} alt={popup.title} className={styles.image} />
      </div>
      <div className="col-9">
        <div className="card-body py-2 px-3">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className={styles.title}>{popup.title}</h5>
            <div className={styles.heartIcon} onClick={onToggle}>
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

export default FavoriteCard;
