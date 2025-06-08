import { useState } from "react";
import PendingReview from "./PendingReview";
import WrittenReview from "./WrittenReview";

const MyReviews = () => {
  const [subTab, setSubTab] = useState("written"); // 작성 or 미작성

  return (
    <div className="myreviews-wrapper">
      {subTab === "written" ? (
        <WrittenReview goToPending={() => setSubTab("pending")} />
      ) : (
        <PendingReview goToWritten={() => setSubTab("written")} />
      )}
    </div>
  );
};

export default MyReviews;
