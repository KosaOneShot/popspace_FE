import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NoticeForm.css";
import axi from "../../utils/axios/Axios";

const NoticeForm = ({ popupId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [agree, setAgree] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleImageRemove = () => {
    setImage(null);
    document.getElementById("image").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("작성 시 안내 문구에 동의해주세요.");
      return;
    }

    if (!title || !content || !image) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("popupId", popupId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await axi.post("/notifications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("공지 등록 성공!");
      setTitle("");
      setContent("");
      setImage(null);
      setAgree(false);
    } catch (err) {
      console.error(err);
      alert("공지 등록 실패");
    }
  };

  return (
    <div className="notice-form-container d-flex flex-column align-items-center px-4 py-5">
      <h5 className="text-success fw-bold mb-4">공지 작성</h5>

      <form
        onSubmit={handleSubmit}
        className="w-100"
        style={{ maxWidth: "400px" }}
      >
        {/* 이미지 업로드 */}
        <div className="mb-4 text-center">
          <label htmlFor="image" className="form-label d-block fw-semibold">
            사진
          </label>

          <div
            className="image-upload-box mx-auto"
            onClick={() => document.getElementById("image").click()}
          >
            {image ? (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  alt="미리보기"
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={handleImageRemove}
                >
                  ×
                </button>
              </>
            ) : (
              <span className="text-muted">+</span>
            )}
          </div>

          <input
            type="file"
            id="image"
            accept="image/*"
            className="form-control visually-hidden"
            onChange={handleImageChange}
            disabled={image !== null}
          />

          <div className="text-muted small mt-1">{image ? "1/1" : "0/1"}</div>
        </div>

        {/* 제목 */}
        <div className="mb-3">
          <label className="form-label">공지 제목</label>
          <input
            type="text"
            className="form-control rounded-input"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 */}
        <div className="mb-3">
          <label className="form-label">공지 내용</label>
          <textarea
            className="form-control rounded-input"
            rows="4"
            placeholder="작성하신 공지는 해당 팝업을 예약한 고객에게 팝업 형태로 안내됩니다. 중요한 공지 사항은 정확하고 신중하게 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 체크박스 */}
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="agreeCheck"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label
            className="form-check-label text-muted small"
            htmlFor="agreeCheck"
          >
            글 등록 시 해당 팝업을 예약한 고객에게 팝업 형태로 안내됩니다.{" "}
            <br />
            중요한 공지 사항은 정확하고 신중하게 작성해주세요.
          </label>
        </div>

        {/* 완료 버튼 */}
        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: agree ? "#6c757d" : "#d3d3d3",
            color: "white",
            cursor: agree ? "pointer" : "not-allowed",
          }}
          disabled={!agree}
        >
          완료
        </button>
      </form>
    </div>
  );
};

export default NoticeForm;
