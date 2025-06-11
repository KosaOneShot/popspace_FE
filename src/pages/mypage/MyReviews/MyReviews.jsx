import { useState } from "react";
import PendingReview from "./PendingReview";
import WrittenReview from "./WrittenReview";
import TabSwitcher from "../TabSwitcher";
const MyReviews = () => {
  const [subTab, setSubTab] = useState("written");

  const tabs = [
    { key: "pending", label: "미작성 리뷰" },
    { key: "written", label: "작성한 리뷰" },
  ];

  return (
    <div className="myreviews-wrapper container">
      {/* 탭 버튼 */}
      <TabSwitcher tabs={tabs} activeTab={subTab} onChange={setSubTab} />

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
