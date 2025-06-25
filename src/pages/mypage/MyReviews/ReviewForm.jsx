import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import axi from "../../../utils/axios/Axios";

function ReviewForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const data = location.state?.data;
  const idFromUrl = query.get("id");
  const MAX_CONTENT_LENGTH = 160;

  const isEditMode = !!data?.content;

  const [form, setForm] = useState({
    id: data?.reviewId || idFromUrl,
    title: data?.title || "",
    visitedDate: data?.visitedDate || "",
    rating: data?.rating || 0,
    content: data?.content || "",
    imageUrl: data?.imageUrl || "",
  });

  const [loading, setLoading] = useState(false);

  // 새로고침했을 때 data 없으면 백엔드 fetch
  useEffect(() => {
    const fetchReviewData = async () => {
      if (!isEditMode || idFromUrl) return;

      try {
        const res = await axi.get(`/api/reviews/pending/${idFromUrl}`);
        setForm({
          id: idFromUrl,
          title: res.data.title,
          visitedDate: res.data.visitedDate,
          rating: 0,
          content: "",
          imageUrl: res.data.imageUrl,
        });
      } catch (err) {
        console.error("리뷰 데이터 조회 실패", err);
        alert("데이터를 불러오지 못했습니다.");
        navigate("/mypage");
      }
    };

    fetchReviewData();
  }, [idFromUrl, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "content" && value.length > MAX_CONTENT_LENGTH) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setForm((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async () => {
    if (form.rating === 0 || form.content.trim() === "") {
      alert("별점과 후기를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await axi.put(`/api/reviews/${form.id}`, {
          rating: form.rating,
          content: form.content,
        });
      } else {
        await axi.post("/api/reviews", {
          reserveId: query.get("id"),
          rating: form.rating,
          content: form.content,
        });
      }
      navigate("/mypage", { state: { tab: "myReviews" } });
    } catch (err) {
      console.error("저장 실패", err);
      alert("저장 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!form.title)
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
          value={form.title}
          readOnly
          style={{
            outline: 'none',
            boxShadow: 'none',
            border: '1px solid #ccc',
            borderColor: '#ccc',
            backgroundColor: '#ccc'
          }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">방문 날짜</label>
        <input
          type="text"
          className="form-control text-muted"
          value={form.visitedDate}
          readOnly
          style={{
            outline: 'none',
            boxShadow: 'none',
            border: '1px solid #ccc',
            borderColor: '#ccc',
            backgroundColor: '#ccc'
          }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">별점</label>
        <StarRating rating={form.rating} onChange={handleRatingChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">후기 내용</label>
        <textarea
          className="form-control"
          rows="6"
          name="content"
          value={form.content}
          onChange={handleChange}
          maxLength={MAX_CONTENT_LENGTH}
          placeholder="작성하신 후기는 다른 고객들에게 큰 도움이 될 수 있습니다."
          style={{
            outline: 'none',
            boxShadow: 'none',
            border: '1px solid #ccc',
            borderColor: '#ccc'
          }}
        />
      </div>

      <button
        className="btn-emerald w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "저장 중..." : isEditMode ? "수정 완료" : "작성 완료"}
      </button>
    </div>
  );
}

export default ReviewForm;
