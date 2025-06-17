// src/popup/PopupDetailFooter.jsx
import React, { useState, useEffect } from "react";
import { axiUpdatePopupLike } from "./popupAxios";
import { fetchWalkInPreview, postWalkInReservation } from "../reservation/ReservationAxios";
import { useNavigate } from "react-router-dom";
// src/popup/PopupDetailFooter.jsx
import '../pages/reservation/WalkInModal.css';

/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = ({ popupId, like, isLogined }) => {
  const [isLiked, setIsLiked] = useState(like);
  const [waitingInfo, setWaitingInfo] = useState(null);
  const navigate = useNavigate();
  // 현장 웨이팅 모달
  const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!showModal) return;

        const fetchData = async () => {
            const preview = await fetchWalkInPreview(popupId);
            if (preview) {
                setWaitingInfo(preview);
            }
        };

        fetchData();
    }, [showModal, popupId]);

    // 부모에서 like prop이 바뀌면 동기화
  useEffect(() => {
    setIsLiked(like);
  }, [like]);

  // 찜 버튼 클릭 시 호출되는 함수
  const handleLikeToggle = async () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      await axiUpdatePopupLike(popupId, next);
    } catch (err) {
      console.error("찜 상태 업데이트 실패:", err);
      setIsLiked(prev => !prev);
    }
  };

  // 사전 예약 버튼 클릭 시 호출
  const handleAdvanceClick = () => {
      navigate(`/popups/${popupId}/reservation`);
  };

  // 모달에서 웨이팅하기 버튼 클릭시 호출
  const handleWalkInReserve = async () => {
      try {
          await postWalkInReservation(popupId);
          alert("현장 예약 완료!");
          setShowModal(false);
      } catch (err) {
          alert("예약 실패: " + (err.response?.data?.message || "오류 발생"));
      }
  };



  return (
      <>
          {/* 모달은 가장 바깥에서 렌더링 */}
          {showModal && (
              <div className="modal-backdrop">
                  <div className="modal-content">
                      <h5 style={{ marginBottom: '16px' }}>현장 웨이팅 예약</h5>

                      {waitingInfo && (
                          <div style={{
                              marginBottom: '8px',
                              fontSize: '0.95rem',
                              color: '#555',
                              lineHeight: 1.6,
                              textAlign: 'left',
                              marginTop: '12px'
                          }}>
                              <p><strong>현재 대기 순번:</strong> {waitingInfo.sequence}</p>

                              {waitingInfo.averageWaitTime === -1 ? (
                                  <>
                                      <p><strong>예상 대기 시간:</strong> 없음 (즉시 입장 가능)</p>
                                      <p><strong>예상 입장 시간:</strong> 곧 입장 예정</p>
                                  </>
                              ) : (
                                  <>
                                      <p><strong>예상 대기 시간:</strong> {waitingInfo.averageWaitTime}분</p>
                                      <p><strong>예상 입장 시간:</strong> {waitingInfo.entranceTime}</p>
                                  </>
                              )}
                          </div>
                      )}
                      {/*<p>현장 예약 하시겠습니까?</p>*/}

                      {/* 예약하기 버튼 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '16px' }}>
                          <button
                              className="btn btn-secondary w-50"
                              onClick={() => setShowModal(false)}
                          >닫기
                          </button>

                          <button
                              className="btn w-50"
                              onClick={handleWalkInReserve}
                              style={{ backgroundColor: '#1D9D8B', color: '#fff', border: 'none' }}
                          >예약하기
                          </button>
                      </div>
                  </div>
              </div>

          )}

    <div
      className="position-fixed"
      style={{
        bottom: "75px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "390px",
        height: "70px",
        zIndex: 1000,
        backgroundColor: "#F7F6F3",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        padding: "4px",
      }}
    >
    {/* 사전예약 버튼 */}
    <button
      type="button"
      disabled={!isLogined}
      className="btn me-2"
      onClick={handleAdvanceClick}
      style={{
        width: "43%",
        borderRadius: "8px",
        height: "80%",
        backgroundColor: isLogined ? "#8250DF" : "#ccc",
        color: isLogined ? "#fff" : "#666"
      }}
    >
      사전 예약
    </button>

    {/* 웨이팅 버튼 */}
    <button
      type="button"
      disabled={!isLogined}
      className="btn"
      onClick={() => setShowModal(true)}
      style={{
        width: "43%",
        borderRadius: "8px",
        height: "80%",
        backgroundColor: isLogined ? "#000" : "#ccc",
        color: isLogined ? "#fff" : "#666"
      }}
    >
      현장 웨이팅
    </button>

    {/* 찜하기 버튼 */}
    <button
      type="button"
      disabled={!isLogined}
      className={`btn ms-2 d-flex justify-content-center align-items-center ${
        isLogined
          ? isLiked
            ? "btn-danger"
            : "btn-outline-danger"
          : "btn-secondary"
      }`}
      style={{
        borderRadius: "8px",
        width: "40px",
        height: "80%",
        padding: 0,
        pointerEvents: isLogined ? "auto" : "none"
      }}
      onClick={handleLikeToggle}
    >
      <i
        className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
        style={{
          fontSize: "1.2rem",
          color: isLogined ? undefined : "#666"
        }}
      />
    </button>
    </div>
      </>
  );
};

export default FooterButtons;