import React, { useState, useEffect } from "react";
import axi from "../../../utils/axios/Axios";
// import AddressModal from "../../../components/modal/AddressModal";
import "./MyPageAccount.css";

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
  const [loading, setLoading] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDaumPostOpen, setIsDaumPostOpen] = useState(false);

  useEffect(() => {
    axi
      .get("/api/member/me")
      .then((res) => {
        setForm(res.data);
        setOriginalNickname(res.data.nickname);
      })
      .catch((err) => console.error("회원정보 가져오기 실패", err));
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "nickname") {
      setIsNicknameChecked(false);
      setNicknameMessage("");
    }
  };

  const handleAddressComplete = (data) => {
    setForm((prev) => ({
      ...prev,
      roadAddress: data.roadAddress,
    }));
    setIsDaumPostOpen(false);
  };

  const handleCheckNickname = async () => {
    if (form.nickname === originalNickname) {
      setIsNicknameChecked(true);
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      return;
    }

    try {
      await axi.post("/auth/nickname/check-duplication", {
        nickname: form.nickname,
      });
      setIsNicknameChecked(true);
      setNicknameMessage("사용 가능한 닉네임입니다.");
    } catch (err) {
      setIsNicknameChecked(false);
      setNicknameMessage(
        err.response?.status === 409
          ? "이미 사용 중인 닉네임입니다."
          : "검증 중 오류가 발생했습니다."
      );
    }
  };

  const validateForm = () => {
    for (let key of Object.keys(form)) {
      if (form[key] === "" || form[key] === null) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMsg("모든 항목을 입력해주세요.");
      return;
    }

    if (form.nickname !== originalNickname && !isNicknameChecked) {
      setErrorMsg("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    setLoading(true);
    try {
      await axi.put("/api/member/update", form);
      setSuccessMsg("회원정보가 수정되었습니다.");
    } catch (err) {
      console.error("회원정보 수정 실패", err);
      setErrorMsg("수정 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account-form pb-3">
      <div className="mb-3">
        <label className="form-label account-label">이메일</label>
        <input
          type="email"
          className="form-control text-muted"
          value={form.email}
          disabled
        />
      </div>

      <div className="mb-3">
        <label className="form-label account-label">이름</label>
        <input
          type="text"
          className="form-control text-muted"
          value={form.memberName}
          disabled
        />
      </div>

      <div className="mb-3">
        <label className="form-label account-label">전화번호</label>
        <input
          type="text"
          className="form-control text-muted"
          value={form.phoneNumber}
          disabled
        />
      </div>

      <div className="mb-3">
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <label className="form-label account-label">닉네임</label>
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
        {nicknameMessage && (
          <div
            className={`small mt-1 ${
              isNicknameChecked ? "text-success" : "text-danger"
            }`}
          >
            {nicknameMessage}
          </div>
        )}
      </div>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label account-label">생년월일</label>
          <input
            type="date"
            name="birthDate"
            className="form-control"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <label className="form-label account-label">성별</label>
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
        <label className="form-label account-label mb-0">주소</label>
        <button
          type="button"
          className="btn-emerald btn-sm"
          onClick={() => setIsDaumPostOpen(true)}
        >
          주소 검색
        </button>
      </div>

      {/* {isDaumPostOpen && (
        <AddressModal
          onComplete={handleAddressComplete}
          onClose={() => setIsDaumPostOpen(false)}
        />
      )} */}

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
      {errorMsg && <div className="text-danger small mb-2">{errorMsg}</div>}
      {successMsg && (
        <div className="text-success small mb-2">{successMsg}</div>
      )}
      <button type="submit" className="btn-emerald w-100" disabled={loading}>
        {loading ? "수정 중..." : "수정하기"}
      </button>
    </form>
  );
};

export default ProfileInfo;
