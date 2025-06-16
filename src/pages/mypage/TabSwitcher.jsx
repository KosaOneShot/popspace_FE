import React from "react";
import styles from "./TabSwitcher.module.css";

const TabSwitcher = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tab-wrap d-flex justify-content-center mb-3">
      <div
        className={`${styles.tabGroup} d-flex bg-light border overflow-hidden w-100`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} w-100 ${
              activeTab === tab.key ? styles.active : ""
            }`}
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
