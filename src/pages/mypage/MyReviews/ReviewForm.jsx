import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

function ReviewForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const data = location.state?.data;
  const [reviewData, setReviewData] = useState(data || null);
  const isEditMode = !!data?.content;
  const [rating, setRating] = useState(data?.rating || 0);
  const [content, setContent] = useState(data?.content || "");

  useEffect(() => {
    if (!reviewData) {
      const id = query.get("id");
      if (id) {
        fetch(`/api/pending-reviews/${id}`)
          .then((res) => res.json())
          .then((data) => setPopupInfo(data));
      }
    }
  }, [reviewData, query]);

  const handleSubmit = () => {
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/reviews/${reviewData.id}` : "/api/reviews";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewData.id, rating, content }),
    }).then(() => navigate("/mypage", { state: { tab: "myReviews" } }));
  };

  if (!reviewData)
    return <div className="container py-5 text-center">로딩 중...</div>;

  return (
    <div className="container py-4 bg-light min-vh-100">
      <h3 className="text-success mb-4 fw-bold text-center">
        {isEditMode ? "후기 수정" : "후기 작성"}
      </h3>

      <div className="mb-3">
        <label className="form-label">방문 팝업</label>
        <input
          type="text"
          className="form-control text-muted"
          value={reviewData.title}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label className="form-label">방문 날짜</label>
        <input
          type="text"
          className="form-control text-muted"
          value={reviewData.visitedDate}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label className="form-label">별점</label>
        <StarRating rating={rating} onChange={setRating} />
      </div>

      <div className="mb-3">
        <label className="form-label">후기 내용</label>
        <textarea
          className="form-control"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="작성하신 후기는 다른 고객들에게 큰 도움이 될 수 있습니다. 부적절한 내용이 포함된 경우 사전 통보 없이 삭제될 수 있습니다."
        />
      </div>

      <button className="btn-emerald w-100" onClick={handleSubmit}>
        {isEditMode ? "수정 완료" : "작성 완료"}
      </button>
    </div>
  );
}

export default ReviewForm;
