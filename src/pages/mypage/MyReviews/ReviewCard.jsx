import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

// 실제 사용 시

const ReviewCard = ({ review }) => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded shadow-sm mb-3 p-3"
      style={{ backgroundColor: "white", border: "1px solid #ddd" }}
    >
      <div
        className="fw-bold small mb-1"
        style={{ color: "#444", fontSize: "13px" }}
      >
        {review.title}
      </div>
      <div className="border-bottom mb-2" style={{ borderColor: "#ccc" }}></div>

      <div className="d-flex align-items-start">
        <img
          src={review.imageUrl}
          alt="popup"
          className="rounded me-3"
          style={{
            width: "65px",
            height: "65px",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div className="flex-grow-1">
          <div className="text-muted" style={{ fontSize: "12px" }}>
            방문일: {review.visitedDate}
          </div>
          <div
            className="small mt-1 mb-2"
            style={{
              fontSize: "13px",
              lineHeight: "1.5",
              wordBreak: "break-word",
            }}
          >
            {review.content}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <StarRating rating={review.rating} readOnly />
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm p-1 text-muted border-0 bg-transparent"
                onClick={() =>
                  navigate(`/edit-review?id=${review.id}`, {
                    state: { data: review },
                  })
                }
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
              <button
                className="btn btn-sm p-1 text-muted border-0 bg-transparent"
                onClick={() => {}}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
