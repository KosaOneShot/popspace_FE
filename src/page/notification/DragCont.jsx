import React from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import NoticePopup from "./NoticePopup";

const DragCont = (props) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ offset: [ox, oy] }) => {
    const clampedX = Math.min(Math.max(ox, 0), windowWidth - 360); // 360은 팝업 가로 너비
    const clampedY = Math.min(Math.max(oy, 0), windowHeight - 400); // 400은 팝업 세로 높이
    api.start({ x: clampedX, y: clampedY });
  });

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        position: "fixed",
        zIndex: 9999,
        touchAction: "none",
      }}
    >
      <NoticePopup {...props} />
    </animated.div>
  );
};

export default DragCont;
