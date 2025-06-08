// FavoritePopups.jsx
import React, { useEffect, useState } from "react";
import axi from "../../../utils/axios/Axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./FavoritePopups.css";

const FavoritePopups = () => {
  const [favorites, setFavorites] = useState([
    {
      popupId: 1,
      title: "빵빵이의 타로집 in 신세계 강남점",
      dateRange: "2025년 6월 1일 - 6월 20일",
      location: "신세계백화점 강남점 지하1층",
      imageUrl: "https://placehold.co/400x400.png?text=popup",
      liked: true,
    },
    {
      popupId: 2,
      title: "무무의 팝업스토어 in 코엑스몰",
      dateRange: "2025년 6월 10일 - 6월 30일",
      location: "스타필드 코엑스몰 B1 이벤트홀",
      imageUrl: "https://placehold.co/400x400.png?text=popup",
      liked: true,
    },
    {
      popupId: 3,
      title: "오늘의 작가전 in 현대백화점",
      dateRange: "2025년 5월 20일 - 6월 15일",
      location: "현대백화점 판교점 10층 문화홀",
      imageUrl: "https://placehold.co/400x400.png?text=popup",
      liked: true,
    },
  ]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axi.get("/favorites");
      setFavorites(res.data);
    } catch (err) {
      console.error("관심 팝업 불러오기 실패", err);
    }
  };

  const toggleFavorite = async (popupId) => {
    try {
      // await axi.delete(`/favorites/${popupId}`);
      setFavorites((prev) => prev.filter((popup) => popup.popupId !== popupId));
    } catch (err) {
      console.error("관심 해제 실패", err);
    }
  };

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
