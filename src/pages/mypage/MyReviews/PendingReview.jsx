import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axi from "../../../utils/axios/Axios";
import styles from "./MyReviews.module.css";

function PendingReview() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axi.get("/api/reviews/pending");
        setPending(res.data);
      } catch (err) {
        console.error("미작성 후기 조회 실패", err);
      }
    };

    fetchPending();
  }, []);

  return (
    <div className="container pb-3 min-vh-100">
      {pending.map((popup) => (
        <div
          className={`card mb-3 shadow-sm w-100 ${styles.card}`}
          key={popup.reserveId}
        >
          <div className="card-body d-flex align-items-center p-3">
            <img
              src={popup.imageUrl}
              alt="popup"
              className={styles.thumbnail}
              style={{ width: 55, height: 55 }}
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
