import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axi from "../../../utils/axios/Axios";

const WrittenReview = ({ goToPending }) => {
  const [reviews, setReviews] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    axi
      .get("/api/reviews")
      .then((res) => {
        setReviews(res.data.written);
        setPendingCount(res.data.pendingCount);
      })
      .catch((err) => {
        console.error("리뷰 불러오기 실패", err);
      });
  }, []);

  return (
    <div className="container bg-light pb-3 min-vh-100">
      <h4 className="fw-bold text-emerald mb-3 text-center">작성 후기</h4>
      <div className="pb-3">
        <button className="btn-emerald w-100" onClick={goToPending}>
          미작성 후기 쓰러가기 ({pendingCount}건)
        </button>
      </div>

      {reviews?.map((review) => (
        <ReviewCard
          review={review}
          key={review.reviewId}
          onDelete={(id) =>
            setReviews((prev) => prev.filter((r) => r.reviewId !== id))
          }
        />
      ))}
    </div>
  );
};

export default WrittenReview;
