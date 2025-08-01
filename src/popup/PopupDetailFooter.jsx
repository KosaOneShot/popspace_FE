// src/popup/PopupDetailFooter.jsx
import React, { useState, useEffect } from "react";
import {createPortal} from 'react-dom';
import { axiUpdatePopupLike } from "./popupAxios";
import { fetchWalkInPreview, postWalkInReservation, postImmediateReservation } from "../reservation/ReservationAxios";
import { useNavigate } from "react-router-dom";
import '../pages/reservation/WalkInModal.css';

/** 하단 “예약하기 + 찜하기” 버튼 바 */
const FooterButtons = ({ popupId, like, isLogined }) => {
  const [isLiked, setIsLiked] = useState(like);
  const [waitingInfo, setWaitingInfo] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmReserveId, setConfirmReserveId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isAllowed, setIsAllowed] = useState(null);

  // 모달 열릴 때 미리보기 데이터 로드
  useEffect(() => {
    if (!showModal) return;

    const fetchData = async () => {
      const preview = await fetchWalkInPreview(popupId);

      if (preview) {
          setWaitingInfo(preview);
          setIsAllowed(preview.isAllowed);
          console.log("preview.isAllowed:", preview.isAllowed);
      }
    };

    fetchData();
  }, [showModal, popupId]);

  // 부모에서 like prop이 바뀌면 동기화
  useEffect(() => {
    setIsLiked(like);
  }, [like]);

  // 찜 토글
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

  // 사전 예약
  const handleAdvanceClick = () => {
    navigate(`/popups/${popupId}/reservation`);
  };

  // 현장 웨이팅 예약
  const handleWalkInReserve = async () => {
    try {
      const response = await postWalkInReservation(popupId);
      setConfirmReserveId(response.reserveId);
      setConfirmMessage("현장 예약이 완료되었습니다");
    } catch (err) {
      console.error("예약 실패:", err);
      setConfirmReserveId(null);
      
      setConfirmMessage(`예약 실패 : ${err.response?.data?.message || "오류 발생"}`);
    }
    setShowConfirm(true);
  };

    // 즉시 입장 예약
    const handleImmediateEnter = async () => {
        try {
            const response = await postImmediateReservation(popupId);
            setConfirmReserveId(response.reserveId);
            setConfirmMessage("즉시 입장 신청이 완료되었습니다.");
        } catch (err) {
            console.error("예약 실패:", err);
            setConfirmReserveId(null);

            setConfirmMessage(`예약 실패 : ${err.response?.data?.message || "오류 발생"}`);
        }
        setShowConfirm(true);
    };

  return (
    <>
      {/* 모달 백드롭 + 콘텐츠를 document.body에 포탈 */}
      {showModal && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            style={{
              position: 'fixed',
              top: '30%', left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2001,
              maxWidth: '400px',
              width: '90%',
              padding: '24px',
              borderRadius: '8px',
              background: '#fff',
            }}
            onClick={e => e.stopPropagation()}
          >
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

                      {/* 예약하기 버튼 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '16px' }}>
                          <button
                              className="btn btn-secondary w-50"
                              onClick={() => setShowModal(false)}
                          >닫기
                          </button>

                          <button
                              className="btn w-50"
                              onClick={isAllowed ? handleImmediateEnter : handleWalkInReserve}
                              style={{ backgroundColor: '#8250DF', color: '#fff', border: 'none' }}
                          >
                              {isAllowed === null
                                  ? "웨이팅 확인 중"
                                  : isAllowed
                                      ? "즉시 입장"
                                      : "현장 웨이팅"}
                          </button>

                      </div>
                  </div>
              </div>,
              document.body
          )}

      {showConfirm && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 3000,
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{
              position: 'fixed',
              top: '40%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              textAlign: 'center',
              zIndex: 3001,
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ marginBottom: '16px' }}>{confirmMessage}</p>
            <button
              className="btn"
              style={{ backgroundColor: '#8250DF', color: '#fff' }}
              onClick={() => {
                setShowConfirm(false);
                if (confirmReserveId) {
                  navigate(`/reservation/detail/${confirmReserveId}`);
                } else {
                  navigate(`/popup/detail/${popupId}`);
                }
                setShowModal(false);
              }}
            >
              확인
            </button>
          </div>
        </div>,
        document.body
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
            isLogined ? (isLiked ? 'btn-danger' : 'btn-outline-danger') : 'btn-secondary'
          }`}
          style={{
            borderRadius: '8px',
            width: '40px',
            height: '80%',
            padding: 0,
            pointerEvents: isLogined ? 'auto' : 'none'
          }}
          onClick={handleLikeToggle}
        >
          <i
            className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}
            style={{ fontSize: '1.2rem', color: isLogined ? undefined : '#666' }}
          />
        </button>
      </div>
    </>
  );
};

export default FooterButtons;