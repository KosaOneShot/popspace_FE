import React, { useState } from "react";
import ProfileInfo from "./Profile/ProfileInfo";
import FavoritePopups from "./FavoritePopup/FavoritePopups";
import ReviewList from "./MyReviews/MyReviews";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyPage.css";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "favorites":
        return <FavoritePopups />;
      case "myReviews":
        return <ReviewList />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="mypage-wrapper container py-5 px-3">
      <h2 className="mypage-title text-center mb-5 fw-bold">마이페이지</h2>

      <ul className="custom-tab-nav d-flex justify-content-around mb-3 border-bottom">
        <li
          className={`tab-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          회원 정보
        </li>
        <li
          className={`tab-item ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          관심 팝업
        </li>
        <li
          className={`tab-item ${activeTab === "myReviews" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("myReviews");
          }}
        >
          내 후기
        </li>
      </ul>

      <div className="mypage-content">{renderTab()}</div>
    </div>
  );
};

export default MyPage;
