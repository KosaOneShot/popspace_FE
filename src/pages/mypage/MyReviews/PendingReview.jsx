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
      <h4 className="fw-bold text-emerald mb-3 text-center">미작성 후기</h4>

      {pending.map((popup) => (
        <div className="card mb-3 shadow-sm" key={popup.reserveId}>
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
                navigate(`/write-review?id=${popup.reserveId}`, {
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
