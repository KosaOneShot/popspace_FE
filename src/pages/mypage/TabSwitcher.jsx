// components/common/TabSwitcher.jsx
import React from "react";
import "./TabSwitcher.css"; // 버튼 공통 스타일 정의

const TabSwitcher = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tab-wrap d-flex justify-content-center mb-3">
      <div className="tab-group d-flex bg-light border overflow-hidden w-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn w-100 ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
