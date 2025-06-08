import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PendingReview({ goToWritten }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    // fetch("/api/pending-reviews")
    //   .then((res) => res.json())
    //   .then((data) => setPending(data));
    setPending([
      {
        id: 1,
        title: "빵빵이의 타로집 in 신세계 강남 팝업",
        visitedDate: "2025년 6월 1일",
        imageUrl: "https://placehold.co/400x1000.png",
      },
      {
        popupId: 2,
        title: "무무의 팝업스토어 in 코엑스몰",
        visitedDate: "2025년 6월 10일",
        imageUrl: "https://placehold.co/400x400.png?text=popup",
      },
      {
        popupId: 3,
        title: "오늘의 작가전 in 현대백화점",
        visitedDate: "2025년 5월 20일",
        imageUrl: "https://placehold.co/400x400.png?text=popup",
      },
    ]);
  }, []);

  return (
    <div className="container py-2 bg-light min-vh-100">
      <h4 className="fw-bold text-emerald mb-3 text-center">미작성 후기</h4>

      {pending.map((popup) => (
        <div className="card mb-3 shadow-sm" key={popup.id}>
          <div className="card-body pb-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src={popup.imageUrl}
                alt="popup"
                className="me-3 rounded"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div>
                <h6>{popup.title}</h6>
                <p className="text-muted small">방문일: {popup.visitedDate}</p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <button
              className="btn-emerald w-100"
              onClick={() =>
                navigate(`/write-review?id=${popup.id}`, {
                  state: { data: popup },
                })
              }
            >
              후기 작성하기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingReview;
