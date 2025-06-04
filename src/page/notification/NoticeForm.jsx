import React, { useState } from "react";
import axi from "../../utils/axios/Axios";

const NoticeForm = ({ popupId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [agree, setAgree] = useState(false);

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
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        📢 공지 작성
      </h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-5"
      >
        {/* 이미지 업로드 */}
        <div>
          <label
            htmlFor="imageUpload"
            className="block text-gray-600 font-medium mb-2"
          >
            이미지 업로드
          </label>
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && <p className="text-sm mt-2 text-gray-500">{image.name}</p>}
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            공지 제목
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            공지 내용
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="중요한 공지 사항을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* 동의 체크 */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="confirm"
            className="mt-1 h-4 w-4 text-green-500 border-gray-300 rounded"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label
            htmlFor="confirm"
            className="text-sm text-gray-700 leading-snug"
          >
            글 등록 시 해당 팝업을 예약한 고객에게 팝업 형태로 안내됩니다.
            신중하게 작성해주세요.
          </label>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!agree}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition 
            ${
              agree
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          공지 등록
        </button>
      </form>
    </div>
  );
};

export default NoticeForm;
