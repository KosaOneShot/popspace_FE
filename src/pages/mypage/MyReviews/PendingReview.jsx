import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axi from "../../../utils/axios/Axios";

function PendingReview() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    axi
      .get("/api/reviews/pending")
      .then((res) => {
        setPending(res.data);
      })
      .catch((err) => {
        console.error("미작성 후기 조회 실패", err);
      });
  }, []);

  return (
    <div className="container pb-3 bg-light min-vh-100">
      {pending.map((popup) => (
        <div
          className="card mb-3 shadow-sm w-100"
          key={popup.reserveId}
          style={{ borderRadius: "10px", border: "1px solid #e0e0e0" }}
        >
          <div className="card-body d-flex align-items-center p-3">
            <img
              src={popup.imageUrl}
              alt="popup"
              style={{
                width: 55,
                height: 55,
                borderRadius: "8px",
                objectFit: "cover",
                marginRight: "1rem",
                flexShrink: 0,
              }}
            />
            <div className="flex-grow-1">
              <div className="fw-semibold" style={{ fontSize: "14px" }}>
                {popup.title}
              </div>
              <div className="text-muted small mt-1">
                방문일: {popup.visitedDate}
              </div>
            </div>
          </div>

          <div className="px-3 pb-3">
            <button
              className="btn-emerald w-100"
              style={{ fontSize: "14px", padding: "8px 0" }}
              onClick={() =>
                navigate(`/review-form?id=${popup.reserveId}`, {
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
