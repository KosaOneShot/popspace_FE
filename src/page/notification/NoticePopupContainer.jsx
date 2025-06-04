import React, { useEffect, useState } from "react";
import NoticePopup from "./NoticePopup";
import axi from "../../utils/axios/Axios";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";
import DragCont from "./DragCont";

const NoticePopupContainer = ({ nickname }) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (!nickname) return;

    // ✅ 기존 공지들 조회
    axi
      .get(`/notifications/nickname/${nickname}`)
      .then((res) => setNotices(res.data))
      .catch((err) => console.error("공지 불러오기 실패", err));

    // ✅ SSE 실시간 연결
    const sse = new EventSource(
      `${import.meta.env.VITE_API_URL}/sse/subscribe/${nickname}`
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

  const handleClose = (index) => {
    setNotices((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {" "}
      {Array.isArray(notices)
        ? notices.map((notice, idx) => (
            <DragCont
              key={idx}
              title={notice.title}
              content={notice.content}
              imageUrl={notice.imageUrl}
              onClose={() => handleClose(idx)}
              onHideToday={() => console.log("하루 보지 않기")}
            />
          ))
        : null}
    </>
  );
};

export default NoticePopupContainer;
