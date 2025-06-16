import React, { useEffect, useState } from "react";
import NoticePopup from "./NoticePopup";
import axi from "../../utils/axios/Axios";
import Cookies from "js-cookie";
import { useAuth } from "../../components/context/AuthContext";
const NoticePopupContainer = () => {
  const [notices, setNotices] = useState([]);
  const { nickname } = useAuth();

  useEffect(() => {
    // ✅ 기존 공지들 조회
    if (!nickname) return;
    axi
      .get(`/api/notifications`)
      .then((res) => setNotices(res.data))
      .then(console.log("[SSE 수신됨]", notices))
      .catch((err) => console.error("공지 불러오기 실패", err));

    // ✅ SSE 실시간 연결
    const sse = new EventSource(
      `${import.meta.env.VITE_API_URL}/api/sse/subscribe`,
      {
        withCredentials: true,
      }
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
  }, [nickname]);

  const handleClose = (notifyIdToClose) => {
    setNotices((prev) =>
      prev.filter((notice) => notice.notifyId !== notifyIdToClose)
    );
  };

  return (
    <>
      {Array.isArray(notices)
        ? notices
            .filter((n) => !Cookies.get(`hidePopup_${n.notifyId}`)) // ✅ 쿠키 필터링
            .map((notice) => (
              <NoticePopup
                key={notice.notifyId}
                notifyId={notice.notifyId}
                title={notice.title}
                content={notice.content}
                imageUrl={notice.imageUrl}
                onClose={() => handleClose(notice.notifyId)}
              />
            ))
        : null}
    </>
  );
};

export default NoticePopupContainer;
