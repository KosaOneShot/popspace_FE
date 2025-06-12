import React, { useState, useEffect } from "react";
import axi from "../../../utils/axios/Axios";
import AddressModal from "../../../components/modal/AddressModal";
import styles from "./MyPageAccount.module.css";

const ProfileInfo = () => {
  const [form, setForm] = useState({
    email: "",
    memberName: "",
    phoneNumber: "",
    nickname: "",
    birthDate: "",
    sex: "",
    roadAddress: "",
    detailAddress: "",
  });

  const [originalNickname, setOriginalNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState(null); // null, valid, invalid
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [isDaumPostOpen, setIsDaumPostOpen] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axi.get("/api/member/me");
        setForm(res.data);
        setOriginalNickname(res.data.nickname);
      } catch (err) {
        console.error("회원정보 가져오기 실패", err);
      }
    };

    fetchMember();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "nickname") {
      setNicknameStatus(null);
      setNicknameMessage("");
    }
  };

  const handleAddressComplete = (data) => {
    setForm((prev) => ({ ...prev, roadAddress: data.roadAddress }));
    setIsDaumPostOpen(false);
  };

  const handleCheckNickname = async () => {
    if (form.nickname === originalNickname) {
      setNicknameStatus("valid");
      return;
    }

    try {
      await axi.post("/auth/nickname/check-duplication", {
        nickname: form.nickname,
      });
      setNicknameStatus("valid");
      setNicknameMessage("사용 가능한 닉네임입니다.");
    } catch (err) {
      setNicknameStatus("invalid");
      setNicknameMessage(
        err.response?.status === 409
          ? "이미 사용 중인 닉네임입니다."
          : "검증 중 오류가 발생했습니다."
      );
    }
  };

  const validateForm = () => {
    return Object.values(form).every((value) => value !== "" && value !== null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitMsg("");

    if (!validateForm()) {
      setSubmitMsg("모든 항목을 입력해주세요.");
      return;
    }

    if (form.nickname !== originalNickname && nicknameStatus !== "valid") {
      setSubmitMsg("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    setLoading(true);
    try {
      await axi.put("/api/member/update", form);
      setSubmitMsg("회원정보가 성공적으로 수정되었습니다.");
      setOriginalNickname(form.nickname);
      setNicknameMessage("");
    } catch (err) {
      console.error("회원정보 수정 실패", err);
      setSubmitMsg("수정 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.accountForm}>
      <div className="mb-3">
        <label className={`form-label ${styles.accountLabel}`}>이메일</label>
        <input
          type="email"
          className="form-control text-muted"
          value={form.email}
          disabled
        />
      </div>

      <div className="mb-3">
        <label className={`form-label ${styles.accountLabel}`}>이름</label>
        <input
          type="text"
          className="form-control text-muted"
          value={form.memberName}
          disabled
        />
      </div>

      <div className="mb-3">
        <label className={`form-label ${styles.accountLabel}`}>전화번호</label>
        <input
          type="text"
          className="form-control text-muted"
          value={form.phoneNumber}
          disabled
        />
      </div>

      <div className="mb-3">
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <label className={`form-label ${styles.accountLabel}`}>닉네임</label>
          <button
            type="button"
            className="btn-emerald"
            onClick={handleCheckNickname}
          >
            중복 확인
          </button>
        </div>
        <input
          type="text"
          name="nickname"
          className="form-control"
          value={form.nickname}
          onChange={handleChange}
        />
        <div
          className={`small mt-1 ${
            nicknameStatus === "valid"
              ? styles.successMessage
              : styles.errorMessage
          }`}
        >
          {nicknameMessage}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <label className={`form-label ${styles.accountLabel}`}>
            생년월일
          </label>
          <input
            type="date"
            name="birthDate"
            className="form-control"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <label className={`form-label ${styles.accountLabel}`}>성별</label>
          <select
            name="sex"
            className="form-select"
            value={form.sex}
            onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>
      </div>

      <div className="mb-2 d-flex justify-content-between align-items-center">
        <label className={`form-label ${styles.accountLabel}`}>주소</label>
        <button
          type="button"
          className="btn-emerald btn-sm"
          onClick={() => setIsDaumPostOpen(true)}
        >
          주소 검색
        </button>
      </div>

      {isDaumPostOpen && (
        <AddressModal
          onComplete={handleAddressComplete}
          onClose={() => setIsDaumPostOpen(false)}
        />
      )}

      <div className="mb-2">
        <input
          type="text"
          name="roadAddress"
          className="form-control"
          placeholder="도로명 주소"
          value={form.roadAddress}
          readOnly
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          name="detailAddress"
          className="form-control"
          placeholder="상세 주소"
          value={form.detailAddress}
          onChange={handleChange}
        />
      </div>

      <div
        className={`small mb-2 ${
          submitMsg.includes("성공")
            ? styles.successMessage
            : styles.errorMessage
        }`}
      >
        {submitMsg}
      </div>
      <button type="submit" className="btn-emerald w-100" disabled={loading}>
        {loading ? "수정 중..." : "수정하기"}
      </button>
    </form>
  );
};

export default ProfileInfo;
