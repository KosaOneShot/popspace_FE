import React, { useState } from "react";
import axi from "../../../utils/axios/Axios";
import styles from "./MyPageAccount.module.css";

const PasswordChangeForm = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "모든 항목을 입력해주세요." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "새 비밀번호가 일치하지 않습니다." });
      return;
    }

    try {
      setLoading(true);
      await axi.post("/api/member/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      setMessage({
        type: "success",
        text: "비밀번호가 성공적으로 변경되었습니다.",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const code = err.response?.status;
      if (code === 400) {
        setMessage({
          type: "error",
          text: "현재 비밀번호가 일치하지 않습니다.",
        });
      } else {
        setMessage({
          type: "error",
          text: "오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account-form mt-4">
      <div className="mb-3">
        <label className={`form-label ${styles.accountLabel}`}>
          현재 비밀번호
        </label>
        <input
          type="password"
          name="currentPassword"
          className="form-control"
          value={form.currentPassword}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className={`form-label ${styles.accountLabel}`}>
          새 비밀번호
        </label>
        <input
          type="password"
          name="newPassword"
          className="form-control"
          value={form.newPassword}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className={`form-label ${styles.accountLabel}`}>
          새 비밀번호 확인
        </label>
        <input
          type="password"
          name="confirmPassword"
          className="form-control"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>

      {message.text && (
        <div
          className={`small mb-2 ${
            message.type === "success" ? "text-success" : "text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <button className="btn-emerald w-100" type="submit" disabled={loading}>
        {loading ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
};

export default PasswordChangeForm;
