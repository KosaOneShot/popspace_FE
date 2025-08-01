import React, { useState } from "react";
import FavoritePopups from "./FavoritePopup/FavoritePopups";
import ReviewList from "./MyReviews/MyReviews";
import MyPageAccount from "./Profile/MyPageAccount";
import useUserInfo from "../../hook/useUserInfo";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyPage.css";

const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { nickname, role, loading, error } = useUserInfo();
  const tab = location.state?.tab;
  const [activeTab, setActiveTab] = useState(tab || "profile");



  if (!loading && (error || !nickname)) {
    navigate("/auth/login");
    return null;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <MyPageAccount />;
      case "favorites":
        return <FavoritePopups />;
      case "myReviews":
        return <ReviewList />;
      default:
        return <MyPageAccount />;
    }
  };

  return (
    <div className="mypage-wrapper container py-5 px-3 mt-3">
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
          onClick={() => setActiveTab("myReviews")}
        >
          내 후기
        </li>
      </ul>

      <div className="mypage-content">{renderTab()}</div>
    </div>
  );
};

export default MyPage;
