import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axi from "../../../utils/axios/Axios";

const WrittenReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axi.get("/api/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error("리뷰 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r.reviewId !== id));
  };

  if (loading) return <div className="text-center py-5">불러오는 중...</div>;

  return (
    <div className="container bg-light pb-3 min-vh-100">
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          review={review}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default WrittenReview;
