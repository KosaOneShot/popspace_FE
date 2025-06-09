import { useState } from "react";
import PendingReview from "./PendingReview";
import WrittenReview from "./WrittenReview";

const MyReviews = () => {
  const [subTab, setSubTab] = useState("written");

  return (
    <div className="myreviews-wrapper container">
      {/* 탭 버튼 */}
      <div className="review-tab-wrap d-flex justify-content-center mb-3">
        <div className="review-tab-group d-flex bg-light border overflow-hidden w-100">
          <button
            className={`review-tab-btn w-100 ${
              subTab === "pending" ? "active" : ""
            }`}
            onClick={() => setSubTab("pending")}
          >
            미작성 리뷰
          </button>
          <button
            className={`review-tab-btn w-100 ${
              subTab === "written" ? "active" : ""
            }`}
            onClick={() => setSubTab("written")}
          >
            작성한 리뷰
          </button>
        </div>
      </div>

      {/* 탭 내용 */}
      {subTab === "written" ? (
        <WrittenReview goToPending={() => setSubTab("pending")} />
      ) : (
        <PendingReview />
      )}
    </div>
  );
};

export default MyReviews;
