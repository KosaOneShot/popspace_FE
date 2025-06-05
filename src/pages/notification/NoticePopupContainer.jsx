import React, { useEffect, useState } from "react";
import NoticePopup from "./NoticePopup";
import axi from "../../utils/axios/Axios";
import { useAuth } from "../../components/context/AuthContext";

const NoticePopupContainer = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // ✅ 기존 공지들 조회
    axi
      .get(`/notifications`)
      .then((res) => setNotices(res.data))
      .then(console.log("[SSE 수신됨]", notices))
      .catch((err) => console.error("공지 불러오기 실패", err));

    // ✅ SSE 실시간 연결
    const sse = new EventSource(
      `${import.meta.env.VITE_API_URL}/sse/subscribe`
    );

    sse.addEventListener("new-notification", (event) => {
      console.log("[SSE 수신됨]", event.data);
      const data = JSON.parse(event.data);
      setNotices((prev) => [...prev, data]);
    });

    sse.onerror = (err) => {
      console.error("SSE 연결 오류", err);
      sse.close();
    };

    return () => sse.close();
  }, []);

  const handleClose = (notifyIdToClose) => {
    setNotices((prev) =>
      prev.filter((notice) => notice.notifyId !== notifyIdToClose)
    );
  };

  return (
    <>
      {Array.isArray(notices)
        ? notices.map((notice) => (
            <NoticePopup
              key={notice.notifyId}
              title={notice.title}
              content={notice.content}
              imageUrl={notice.imageUrl}
              onClose={() => handleClose(notice.notifyId)}
              onHideToday={() => console.log("하루 보지 않기")}
            />
          ))
        : null}
    </>
  );
};

export default NoticePopupContainer;
