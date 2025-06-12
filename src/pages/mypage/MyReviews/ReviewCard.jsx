import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import axi from "../../../utils/axios/Axios";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import styles from "./MyReviews.module.css";

const ReviewCard = ({ review, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axi.delete(`/api/reviews/${review.reviewId}`);
      onDelete(review.reviewId);
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className={`card p-3 mb-3 shadow-sm ${styles.card}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-bold">{review.title}</h6>
      </div>

      <div className="border-bottom mb-3"></div>

      <div className="d-flex">
        <img src={review.imageUrl} alt="popup" className={styles.thumbnail} />
        <div className="flex-grow-1">
          <div className={`${styles.contentBox}`}>
            <div className="text-muted pb-2">방문일: {review.visitedDate}</div>
            {review.content}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <StarRating rating={review.rating} readOnly />
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm p-1 text-muted border-0 bg-transparent"
                onClick={() =>
                  navigate(`/review-form?id=${review.reviewId}`, {
                    state: { data: review },
                  })
                }
              >
                <BsPencilFill />
              </button>
              <button
                className="btn btn-sm p-1 text-muted border-0 bg-transparent"
                onClick={handleDelete}
              >
                <BsTrashFill />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
