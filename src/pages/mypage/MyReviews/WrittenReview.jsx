import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

const WrittenReview = ({ goToPending }) => {
  const [reviews, setReviews] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // 백엔드에서 리뷰 데이터 불러오기
    // fetch("/api/reviews")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setReviews(data.written);
    //     setPendingCount(data.pendingCount);
    //   });
    setReviews([
      {
        id: 1,
        title: "빵빵이의 타로집 in 신세계 강남 팝업",
        content: "아 사람 넘 많구 대기 넘 길고 그래도 굿굿",
        rating: 3,
        visitedDate: "2025년 6월 1일",
        imageUrl: "https://placehold.co/400x1000.png?text=popup",
      },
      {
        popupId: 2,
        title: "무무의 팝업스토어 in 코엑스몰",
        visitedDate: "2025년 6월 10일",
        content:
          "스타필드 코엑스몰 B1 이벤트홀dsfsdfsdfasdfsdfsdfsdfassafasfasfasfasfdfdsfsdfsdfa",
        imageUrl: "https://placehold.co/400x400.png?text=popup",
        rating: 2,
      },
      {
        popupId: 3,
        title: "오늘의 작가전 in 현대백화점",
        visitedDate: "2025년 5월 20일",
        content: "현대백화점 판교점 10층 문화홀",
        imageUrl: "https://placehold.co/400x400.png?text=popup",
        rating: 4,
      },
    ]);
    setPendingCount(5);
  }, []);

  return (
    <div className="container bg-light min-vh-100">
      <h4 className="fw-bold text-emerald mb-3 text-center">작성 후기</h4>
      <div className="py-3">
        <button className="btn-emerald w-100" onClick={goToPending}>
          미작성 후기 쓰러가기 ({pendingCount}건)
        </button>
      </div>
      {reviews.map((review) => (
        <ReviewCard review={review} key={review.id} />
      ))}
    </div>
  );
};

export default WrittenReview;
