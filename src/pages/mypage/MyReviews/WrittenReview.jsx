import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axi from "../../../utils/axios/Axios";

const WrittenReview = ({ goToPending }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) return <div className="text-center py-5">불러오는 중...</div>;

  return (
    <div className="container bg-light pb-3 min-vh-100">
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
