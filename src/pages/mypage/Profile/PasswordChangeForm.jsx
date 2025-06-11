import React, { useState } from "react";
import axi from "../../../utils/axios/Axios";
import "./MyPageAccount.css";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      await axi.post("api/member/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      setSuccessMsg("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const code = err.response?.status;
      if (code === 400) {
        setErrorMsg("현재 비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMsg("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account-form mt-4">
      <div className="mb-3">
        <label className="form-label account-label">현재 비밀번호</label>
        <input
          type="password"
          className="form-control"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label account-label">새 비밀번호</label>
        <input
          type="password"
          className="form-control"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label account-label">새 비밀번호 확인</label>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {errorMsg && <div className="text-danger small mb-2">{errorMsg}</div>}
      {successMsg && (
        <div className="text-success small mb-2">{successMsg}</div>
      )}
      <button className="btn-emerald w-100" type="submit" disabled={loading}>
        {loading ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
};

export default PasswordChangeForm;
