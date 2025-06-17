import { formatDate, formatTime } from '../utils/TimeFormat';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiFetchMostLikedPopup, axiFetchUpcomingReservation } from './HomeAxios';
import { axiUpdatePopupLike, axiFetchPopupLike } from '../popup/popupAxios';

function PopupCard({ popup }) {
  const navigate = useNavigate();
  const empty = !popup?.popupId;

  const isLogined = popup?.isLogined ?? false;

  const [liked, setLiked] = useState(popup?.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(popup?.likeCount ?? 0);

  useEffect(() => {
    setLiked(popup?.isLiked ?? false);
    setLikeCount(popup?.likeCount ?? 0);
  }, [popup]);

  const handleLikeToggle = (e) => {
    if (empty) return;
    e.stopPropagation();

    const original = liked;
    const toBe = !original;

    setLiked(toBe);
    setLikeCount(c => c + (toBe ? +1 : -1));

    axiUpdatePopupLike(popup.popupId, toBe).catch(err => {
      console.error(err);
      setLiked(original);
      setLikeCount(c => c + (toBe ? -1 : +1));
    });
  };

  return (
    <div className="mb-4">
      <div
        className="ratio ratio-1x1"
        style={{background: empty ? '#f8f9fa' : undefined, cursor: empty ? 'default' : 'pointer' }}
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
            🔥✨ 지금 가장 뜨겁게 주목받는 팝업,<br />
            『 {popup.popupName} 』 🎉
          </p>
        )}

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div
            onClick={isLogined ? handleLikeToggle : undefined}
            style={{
              cursor: isLogined ? (empty ? 'not-allowed' : 'pointer') : 'not-allowed',
              opacity: isLogined ? 1 : 0.5
            }}
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
        <div
          style={{
            height: 150,
            background: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
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

export default function Home() {
  const [mostLikedPopup, setMostLikedPopup] = useState(null);
  const [upcomingReservation, setUpcomingReservation] = useState(null);

  useEffect(() => {
    let popupData;

    axiFetchMostLikedPopup()
      .then(popup => {
        popupData = popup;
        // ✅ return으로 Promise를 넘겨줘야 다음 then에서 받을 수 있음
        return axiFetchPopupLike(popup.popupId);
      })
      .then(({ isLiked, isLogined }) => {
        console.log('팝업 찜 여부:', isLiked, '로그인 여부:', isLogined);
        setMostLikedPopup({ ...popupData, isLiked, isLogined });
      })
      .catch(() => {
        if (popupData) {
          setMostLikedPopup({ ...popupData, isLiked: false, isLogined: false });
        }
      });

    axiFetchUpcomingReservation()
      .then(setUpcomingReservation)
      .catch(console.error);
  }, []);

  return (
    <div className="container" style={{ maxWidth: 390, marginTop: '70px', marginBottom: '90px' }}>
      <section>
        <PopupCard popup={mostLikedPopup} /> {/* ✅ isLogined 제거 */}
      </section>
      <section>
        <h2 className="h5 border-bottom pb-2 mb-5 text-secondary">곧 만날 예약</h2>
        <ReservationCard res={upcomingReservation} />
      </section>
    </div>
  );
}