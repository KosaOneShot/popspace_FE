// ReservationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReservationDetail, fetchReservationQR, fetchWaitingInfo } from './ReservationAxios';
import { formatDate, formatTime, formatDateTime } from '../utils/TimeFormat';


function ReservationInfoRow({ label, value }) {
  return (
    <div className="d-flex mb-2">
      <strong style={{ width: '100px', fontSize : '15px'}}>{label}</strong>
      <span>{value ?? '-'}</span>
    </div>
  );
}

function PopupInfoRow({ label, value }) {
  return (
    <div className="d-flex mb-2">
      <strong style={{ width: '90px', fontSize : '14px' }}>{label}</strong>
      <span style={{fontSize : '14px'}}>{value ?? '-'}</span>
    </div>
  );
}

export default function ReservationDetail() {
  const { reserveId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [waitingInfo, setWaitingInfo] = useState(null);
  const [showWaitingModal, setShowWaitingModal] = useState(false);

  useEffect(() => {
    fetchReservationQR(reserveId)
    .then(setQrUrl)
    .catch(err => {
      console.error('QR 코드 조회 실패', err);
      setQrUrl(null);
    });
    fetchReservationDetail(reserveId)
      .then(setDetail)
      .catch(err => console.error('상세 조회 실패', err));
  }, [reserveId]);  

  if (!detail) return <div className="text-center py-5">로딩 중…</div>;
  
  return (
    <div className="container" style={{ marginTop: '70px', marginBottom: detail.reservationState === '예약완료' ? '170px' : '100px' }}>
      <div className="d-flex align-items-center">
        <button type="button" className="btn btn-light me-3" onClick={() => navigate(-1)}>←</button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <img
          src={qrUrl}
          alt="예약 QR 코드"
          style={{ width: '80%', display: 'block', margin: '0 auto' }}
        />
      </div>
    
    <div style={{textAlign: 'center'}}>
      {/* 대기 정보 */}
      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={async () => {
          try {
            const info = await fetchWaitingInfo(detail.popupId, detail.reserveId);
            if (info) {
              setWaitingInfo(info);
              setShowWaitingModal(true);
            } else {
              alert('대기 정보를 불러올 수 없습니다.');
            }
          } catch (e) {
            console.error('대기 정보 조회 실패', e);
            alert('대기 정보 조회 중 오류가 발생했습니다.');
          }
        }}
      >
        대기 정보 보기
      </button>
    </div>
      
      {/* 예약 정보 */}
      <div className="card mb-4">
        <div className="card-header">예약 상세 (ID: {detail.reserveId})</div>
        <div className="card-body">
          <ReservationInfoRow label="예약일자"   value={formatDate(detail.reserveDate)} />
          <ReservationInfoRow label="예약시간"   value={formatTime(detail.reserveTime)} />         
          <ReservationInfoRow label="예약 타입"     value={detail.reservationType} />
          <ReservationInfoRow label="예약 상태"     value={detail.reservationState} />
          <ReservationInfoRow label="예약자"        value={detail.memberName} />
          <ReservationInfoRow label="생성일시"   value={formatDateTime(detail.createdAt)} />
          <ReservationInfoRow label="취소일시"   value={formatDateTime(detail.canceledAt)} />
        </div>
      </div>




      {/* 팝업 정보 토글 */}
      <div className="text-center mb-3">
        <button
          className="btn"
          style={{ backgroundColor: '#fbeaff', color: '#8250DF', borderRadius: '8px', padding: '10px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          onClick={() => setShowPopup(prev => !prev)}
        >
          {showPopup ? '▼ 가게 정보 접기' : '► 가게 정보 보기'}
        </button>
      </div>

      {/* 팝업 정보 */}
      {showPopup && (
        <div className="card mb-5">
          <div className="card-header">팝업 정보</div>
          <div className="card-body">
            {/* <PopupInfoRow label="팝업 ID"       value={detail.popupId} /> */}
            <PopupInfoRow label="팝업명"        value={detail.popupName} />
            <PopupInfoRow label="위치"          value={detail.location} />
            <PopupInfoRow label="운영 기간"     value={`${formatDate(detail.startDate)} ~ ${formatDate(detail.endDate)}`} />
            <PopupInfoRow label="운영 시간"     value={`${formatTime(detail.openTime)} ~ ${formatTime(detail.closeTime)}`} />
            <PopupInfoRow label="카테고리"      value={detail.category} />
            <PopupInfoRow label="최대 예약 수"  value={detail.maxReservations} />

            {/* 이미지 */}
            <div className="d-flex justify-content-center my-4">
              <img
                src={detail.imageUrl}
                alt={detail.popupName}
                style={{ maxWidth: '70%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
            </div>

            {/* 설명 */}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#555' }}>
              {detail.description || '설명 정보가 없습니다.'}
            </div>
          </div>
        </div>
      )}

      {/* 예약취소 버튼 (오직 RESERVED 상태일 때만) */}
      {detail.reservationState === '예약완료' && (
        <div className="position-fixed"
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
        > <button className="btn btn-danger w-100" style={{ margin: '5px 10px'}}>
            예약취소
          </button>
        </div>
      )}
      {showWaitingModal && waitingInfo && (
        <div className="modal d-block" style={{ inset: 0, position: 'fixed', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }} onClick={() => setShowWaitingModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '320px', margin: '300px auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-content" style={{ borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #eee' }}>
              <div className="p-3 border-bottom">
                <h5 className="fw-bold mb-0" style={{ fontSize: '16px' }}>📋 대기 정보</h5>
              </div>
              <div className="modal-body" style={{ padding: '16px', fontSize: '14px', color: '#333' }}>
                <div className="mb-2"><span className="fw-semibold">🪑 현재 대기 순번:</span> {waitingInfo.sequence}</div>
                <div className="mb-2"><span className="fw-semibold">⏱ 평균 대기 시간:</span> {waitingInfo.averageWaitTime === -1 ? '즉시 입장 가능' : `${waitingInfo.averageWaitTime}분`}</div>
                <div className="mb-2"><span className="fw-semibold">📅 예상 입장 시간:</span> {waitingInfo.entranceTime}</div>
                <div><span className="fw-semibold">🚪 입장 가능 여부:</span> <span style={{ color: waitingInfo.isAllowed ? '#198754' : '#dc3545', fontWeight: 'bold' }}>{waitingInfo.isAllowed ? '입장 가능' : '입장 불가'}</span></div>
              </div>
              <div className="px-3 pb-3">
                <button type="button" className="btn btn-outline-dark w-100 rounded-pill" onClick={() => setShowWaitingModal(false)}>확인</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}