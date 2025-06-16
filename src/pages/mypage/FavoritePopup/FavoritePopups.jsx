import React, { useEffect, useState } from "react";
import axi from "../../../utils/axios/Axios";
import FavoriteCard from "./FavoirteCard";
import styles from "./FavoritePopups.module.css";

const FavoritePopups = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axi.get("/api/favorites");
        const data = res.data.map((popup) => ({
          ...popup,
          liked: true,
        }));
        setFavorites(data);
      } catch (err) {
        console.error("관심 팝업 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (popupId) => {
    try {
      await axi.post(`/api/favorites/toggle/${popupId}`);
      setFavorites((prev) =>
        prev.map((popup) =>
          popup.popupId === popupId ? { ...popup, liked: !popup.liked } : popup
        )
      );
    } catch (err) {
      console.error("관심 토글 실패:", err);
    }
  };

  if (loading) return <div className="text-center py-5">불러오는 중...</div>;

  return (
    <div className={styles.container}>
      {favorites.map((popup) => (
        <FavoriteCard
          key={popup.popupId}
          popup={popup}
          onToggle={() => toggleFavorite(popup.popupId)}
        />
      ))}
    </div>
  );
};

export default FavoritePopups;
