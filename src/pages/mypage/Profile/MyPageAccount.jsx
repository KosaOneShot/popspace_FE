import TabSwitcher from "../TabSwitcher";
import ProfileInfo from "./ProfileInfo";
import PasswordChangeForm from "./PasswordChangeForm";
import { useState } from "react";

const MyPageAccount = () => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { key: "info", label: "정보 수정" },
    { key: "password", label: "비밀번호 변경" },
  ];

  return (
    <div className="container">
      <TabSwitcher tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" ? <ProfileInfo /> : <PasswordChangeForm />}
    </div>
  );
};

export default MyPageAccount;
