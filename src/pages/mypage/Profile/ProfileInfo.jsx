import React, { useState } from "react";
import "./ProfileInfo.css";

const ProfileInfo = () => {
  const [form, setForm] = useState({
    name: "hayoung",
    email: "hayoung@naver.com",
    phone: "010-1111-1111",
    nickname: "HA",
    birth: "2000-01-01",
    gender: "여성",
    address1: "",
    address2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("수정되었습니다.");
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="mb-3">
        <label className="form-label profile-label">이름</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={form.name}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label className="form-label profile-label">이메일</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={form.email}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label className="form-label profile-label">전화번호</label>
        <input
          type="text"
          name="phone"
          className="form-control"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="w-75">
          <label className="form-label profile-label">닉네임</label>
          <input
            type="text"
            name="nickname"
            className="form-control"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-success ms-2 mt-4">
          중복 확인
        </button>
      </div>

      <div className="text-danger small mb-3"></div>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label profile-label">생년월일</label>
          <input
            type="date"
            name="birth"
            className="form-control"
            value={form.birth}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <label className="form-label profile-label">성별</label>
          <select
            name="gender"
            className="form-select"
            value={form.gender}
            onChange={handleChange}
          >
            <option>남성</option>
            <option>여성</option>
          </select>
        </div>
      </div>

      <div className="mb-3 d-flex align-items-center justify-content-between">
        <label className="form-label profile-label">주소</label>
        <button type="button" className="btn btn-success">
          주소 검색
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          name="address1"
          className="form-control"
          placeholder="도로명 주소"
          value={form.address1}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          name="address2"
          className="form-control"
          placeholder="상세 주소"
          value={form.address2}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-secondary w-100 mt-3" disabled>
        수정하기
      </button>
    </form>
  );
};

export default ProfileInfo;
