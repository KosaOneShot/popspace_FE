// ReservationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReservationDetail } from './ReservationAxios';

//'2025-06-17 13:30:00' 형식 포맷팅
function formatDate(str) {
  if (!str) return '-';
  const [datePart, timePart] = str.split(' ');
  const [y, m, d] = datePart.split('-');
  return `${y}년 ${m}월 ${d}일`;
}
function formatTime(str) {
  if (!str) return '-';
  const [datePart, timePart] = str.split(' ');
  const [hh, mm] = timePart.split(':');
  return `${hh}시 ${mm}분`;
}
function formatDateTime(str) {
  if (!str) return '-';
  const [datePart, timePart] = str.split(' ');
  const [y, m, d] = datePart.split('-');
  const [hh, mm] = timePart.split(':');
  return `${y}년 ${m}월 ${d}일 ${hh}시 ${mm}분`;
}

function NewlineText({ text, className, style }) {
  if (!text) return null;
  return (
    <div className={className} style={style}>
      {text.split('\n').map((line, idx, arr) => (
        <React.Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
}


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

  useEffect(() => {
    fetchReservationDetail(reserveId)
      .then(setDetail)
      .catch(err => console.error('상세 조회 실패', err));
  }, [reserveId]);

  if (!detail) return <div className="text-center py-5">로딩 중…</div>;

  return (
    <div className="container" style={{ marginTop: '70px', marginBottom: '90px' }}>
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>← 목록으로</button>

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
          className="btn btn-outline-primary"
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
    </div>
  );
}