import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiFetchMostLikedPopup, axiFetchUpcomingReservation } from './HomeAxios';
import { axiUpdatePopupLike, axiFetchPopupLike } from '../popup/popupAxios';
import { formatDate, formatTime } from '../utils/TimeFormat';

// 인기 팝업 카드 조회 및 찜 처리 컴포넌트
function PopupCard({ popup }) {
  const navigate = useNavigate();
  const empty = !popup?.popupId;
  const [likeCount, setLikeCount] = useState(popup.likeCount);

  useEffect(() => {
    setLikeCount(popup.likeCount);
  }, [popup]);

  return (
    <div className="mb-4">
      <div
        className="ratio ratio-1x1"
        style={{ background: empty ? '#f8f9fa' : undefined, cursor: empty ? 'default' : 'pointer' }}
        onClick={() => !empty && navigate(`/popup/detail/${popup.popupId}`)}
      >
        {empty ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <span className="text-muted">인기 팝업이 없습니다</span>
          </div>
        ) : (
          <img
            src={popup.imageUrl}
            alt={popup.popupName}
            className="img-fluid rounded-top"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="px-3 py-2">
        {!empty && (
          <p className="fw-bold fst-italic mb-2" style={{ fontSize: '17px', color: '#1D9D8B' }}>
            🔥✨ 지금 가장 뜨겁게 주목받는 팝업,<br />『 {popup.popupName} 』 🎉
          </p>
        )}

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <span className="text-muted" style={{fontSize : '12px'}}>좋아요 {likeCount}</span>
          </div>

          <button
            className="btn btn-light btn-sm text-secondary rounded-pill"
            onClick={() => navigate('/popup/list')}
            disabled={empty}
          >
            다른 팝업도 알아보기 »
          </button>
        </div>
      </div>
    </div>
  );
}

// 곧 만날 예약 카드 컴포넌트
function ReservationCard({ res }) {
  const nav = useNavigate();
  const empty = !res?.reserveId;

  return (
    <div className="card shadow-sm mb-4 mx-auto text-center" style={{ width: '53%' }}>
      {empty ? (
        <div
          style={{ height: 150, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="text-muted">예정된 팝업이 없습니다</span>
        </div>
      ) : (
        <img
          src={res.imageUrl}
          alt={res.popupName}
          className="img-fluid"
          style={{ height: 150, objectFit: 'cover' }}
        />
      )}
      <div className="card-body p-3">
        {!empty && (
          <>
            <h6 className="mb-1">{res.popupName}</h6>
            <p className="small text-secondary mb-2">
              {formatDate(res.reserveDate)} {formatTime(res.reserveTime)}
            </p>
            <p className="small text-muted mb-3">{res.location}</p>
          </>
        )}
        <button
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={() => !empty && nav(`/reservation/detail/${res.reserveId}`)}
          disabled={empty}
        >
          예약 상세 보기
        </button>
      </div>
    </div>
  );
}

// 전체 홈 페이지 컴포넌트
export default function Home() {
  const [mostLikedPopup, setMostLikedPopup] = useState(null);
  const [upcomingReservation, setUpcomingReservation] = useState(null);

  useEffect(() => {
    let popupData;
    let isMounted = true;

    (async () => {
      try {
        const popup = await axiFetchMostLikedPopup();
        popupData = popup;
        const { isLiked, isLogined } = await axiFetchPopupLike(popup.popupId);
        if (isMounted) {
          setMostLikedPopup({ ...popupData, isLiked, isLogined });
        }
      } catch (err) {
        console.error('팝업 불러오기 중 오류:', err);
        if (isMounted && popupData) {
          setMostLikedPopup({ ...popupData, isLiked: false, isLogined: false });
        }
      }
    })();

    axiFetchUpcomingReservation()
      .then(res => isMounted && setUpcomingReservation(res))
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container" style={{ maxWidth: 390, marginTop: '70px', marginBottom: '90px' }}>
      <section>{mostLikedPopup && <PopupCard popup={mostLikedPopup} />}</section>
      <section>
        <h2 className="h5 border-bottom pb-2 mb-5 text-secondary">곧 만날 예약</h2>
        {upcomingReservation && <ReservationCard res={upcomingReservation} />}
      </section>
    </div>
  );
}