import React, { useEffect, useState } from "react";
import ProfileInfo from "./Profile/ProfileInfo";
import FavoritePopups from "./FavoritePopup/FavoritePopups";
import ReviewList from "./MyReviews/MyReviews";
import { useLocation, useNavigate } from "react-router-dom";
import MyPageAccount from "./Profile/MyPageAccount";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyPage.css";
import useUserInfo from "../../hook/useUserInfo";

const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = location.state?.tab;
  const [activeTab, setActiveTab] = useState(tab || "profile");
  const { role, nickname, loading } = useUserInfo();

  useEffect(() => {
    if (!loading && !role) {
      navigate("/auth/login");
    }
  }, [loading, role, navigate]);

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
      {/* <h2 className="mypage-title text-center text-emerald mb-3 fw-bold">
        마이페이지
      </h2> */}

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
