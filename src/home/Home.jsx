// Home.jsx
import { formatDate, formatTime } from '../utils/TimeFormat';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiFetchMostLikedPopup, axiFetchUpcomingReservation } from './HomeAxios';
import { axiUpdatePopupLike, axiFetchPopupLike } from '../popup/popupAxios';

function PopupCard({ popup }) {
  const navigate = useNavigate();
  const empty = !popup?.popupId;

  // 좋아요/카운트 로컬 상태
  const [liked, setLiked] = useState(popup?.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(popup?.likeCount ?? 0);

  // 값이 처음 들어올 때 초기화
  useEffect(() => {
    setLiked(popup?.isLiked ?? false);
    setLikeCount(popup?.likeCount ?? 0);
  }, [popup]);

  const handleLikeToggle = e => {
    if (empty) return;
    e.stopPropagation();
    // UI 즉시 반영
    setLikeCount(c => c + (liked ? -1 : +1));
    const toBe = !liked;
    setLiked(toBe);
    axiUpdatePopupLike(popup.popupId, toBe).catch(err => {
      // 롤백
      console.error(err);
      setLiked(liked);
      setLikeCount(c => c + (liked ? +1 : -1));
    });
  };

  return (
    <div className="mb-4">
      <div
        className="ratio ratio-1x1"
        style={{ background: empty ? '#f8f9fa' : undefined, cursor: empty ? 'default' : 'pointer' }}
        onClick={() => !empty && navigate(`/popup/detail/${popup.popupId}`)}
      >
        {empty
          ? <div className="d-flex justify-content-center align-items-center h-100">
              <span className="text-muted">인기 팝업이 없습니다</span>
            </div>
          : <img
              src={popup.imageUrl}
              alt={popup.popupName}
              className="img-fluid rounded-top"
              style={{ objectFit: 'cover' }}
            />}
      </div>

      <div className="px-3 py-2">
        {empty
          ? null
          : <>
              <p className="fw-bold fst-italic mb-2" style={{ fontSize: '17px', color: '#1D9D8B' }}>
                🔥✨ 지금 가장 뜨겁게 주목받는 팝업,<br/>
                『 {popup.popupName} 』 🎉
              </p>
            </>}

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div
            onClick={handleLikeToggle}
            style={{ cursor: empty ? 'not-allowed' : 'pointer' }}
            className="d-flex align-items-center"
          >
            <i className={`bi me-1 ${liked ? 'bi-heart-fill text-danger' : 'bi-heart text-muted'}`} />
            <span className="text-muted small">{likeCount}</span>
          </div>

          <button
            className="btn btn-light btn-sm text-secondary rounded-pill"
            onClick={() => !empty && navigate('/popup/list')}
            disabled={empty}
          >
            다른 팝업도 알아보기 »
          </button>
        </div>
      </div>
    </div>
  );
}

function ReservationCard({ res }) {
  const nav = useNavigate();
  const empty = !res?.reserveId;

  return (
    <div className="card shadow-sm mb-4 mx-auto text-center" style={{ width: '53%' }}>
      {empty ? (
        <div style={{
          height: 150, background: '#f8f9fa',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
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

export default function Home() {
  const [mostLikedPopup, setMostLikedPopup] = useState(null);
  const [upcomingReservation, setUpcomingReservation] = useState(null);

  useEffect(() => {
    // 1) 인기 팝업 + 좋아요 상태
    axiFetchMostLikedPopup()
      .then(popup =>
        axiFetchPopupLike(popup.popupId)
          .then(isLiked => ({ ...popup, isLiked, likeCount: popup.likeCount }))
      )
      .then(setMostLikedPopup)
      .catch(console.error);

    // 2) 곧 만날 예약
    axiFetchUpcomingReservation()
      .then(setUpcomingReservation)
      .catch(console.error);
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 390, margin: '0 auto 60px' }}>
      <section>
        <PopupCard popup={mostLikedPopup} />
      </section>
      <section>
        <h2 className="h5 border-bottom pb-2 mb-5 text-secondary">
          곧 만날 예약
        </h2>
        <ReservationCard res={upcomingReservation} />
      </section>
    </div>
  );
}