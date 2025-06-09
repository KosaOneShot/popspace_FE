// FavoritePopups.jsx
import React, { useEffect, useState } from "react";
import axi from "../../../utils/axios/Axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./FavoritePopups.css";

const FavoritePopups = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axi
      .get("/api/favorites")
      .then((res) =>
        setFavorites(
          res.data.map((popup) => ({
            ...popup,
            liked: true, // 초기 렌더링 시 모두 true로 설정
          }))
        )
      )
      .catch((err) => {
        console.error("관심 팝업 불러오기 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleFavorite = async (popupId) => {
    axi
      .post(`/api/favorites/toggle/${popupId}`)
      .then(() => {
        setFavorites((prev) =>
          prev.map((popup) =>
            popup.popupId === popupId
              ? { ...popup, liked: !popup.liked }
              : popup
          )
        );
      })
      .catch((err) => {
        console.error("관심 해제 실패", err);
      });
  };
  if (loading) return <div className="text-center py-5">불러오는 중...</div>;

  return (
    <div className="favorite-popups-container">
      {favorites.map((popup) => (
        <div key={popup.popupId} className="card favorite-popup-card mb-3">
          <div className="row g-0">
            <div className="col-3">
              <img
                src={popup.imageUrl}
                alt={popup.title}
                className="popup-image"
              />
            </div>
            <div className="col-9">
              <div className="card-body py-2 px-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="popup-title mb-1">{popup.title}</h5>
                  <div
                    className="heart-icon"
                    onClick={() => toggleFavorite(popup.popupId)}
                  >
                    {popup.liked ? (
                      <AiFillHeart color="#FDBA10" size={22} />
                    ) : (
                      <AiOutlineHeart color="#ccc" size={22} />
                    )}
                  </div>
                </div>
                <p className="popup-date mb-1">{popup.dateRange}</p>
                <p className="popup-location mb-0">
                  <i className="bi bi-geo-alt"></i> {popup.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritePopups;
