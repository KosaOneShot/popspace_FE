import { formatDate, formatTime } from '../utils/TimeFormat'; // 날짜/시간 포맷 유틸리티
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiFetchMostLikedPopup, axiFetchUpcomingReservation } from './HomeAxios';
import { axiUpdatePopupLike } from '../popup/popupAxios';

// 지금 가장 뜨겁게 주목받는 팝업
function PopupCard({ popup }) {
  if (!popup) return null;

  const navigate = useNavigate();
  const [liked, setLiked] = useState(popup.isLiked); // 초기값 서버에서 받아오기
  const [likeCount, setLikeCount] = useState(popup.likeCount);

  const handleLikeToggle = () => {
    const toBeState = !liked;
    axiUpdatePopupLike(popup.popupId, toBeState).then(() => {
      setLiked(toBeState);
      setLikeCount(prevCount => prevCount + (toBeState ? 1 : -1));
    });
  };
  return (
    <div className="mb-4">
      <div className="ratio ratio-1x1">
        <img
          src={popup.imageUrl}
          alt={popup.title}
          className="img-fluid rounded-top"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="px-3 py-2">
        <p className="fw-bold fst-italic mb-2" style={{ fontSize: '17px', color: '#1D9D8B' }}>
          🔥✨ 지금 가장 뜨겁게 주목받는 팝업, <br />
          『 {popup.popupName} 』 🎉
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center" onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
            <i className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart text-muted'} me-1`}></i>
            <span className="text-muted small">{likeCount}</span>
          </div>
          <button
            className="btn btn-light btn-sm text-secondary rounded-pill"
            style={{ backgroundColor: '#f8f9fa' }}
            onClick={() => navigate(`/popup/list`)}
          >
            다른 팝업도 알아보기 »
          </button>
        </div>
      </div>
    </div>
  );
}



function ReservationCard({ res }) {
  const navigate = useNavigate();
  
  if (!res) return null; // 데이터가 없을 경우 null 반환
  const reserveDateTime = formatDate(res.reserveDate) + ' ' + formatTime(res.reserveTime);

  return (
    <div
      className="card shadow-sm mb-4 mx-auto"
      style={{
        width: '53%',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
      <img
        src={res.imageUrl}
        alt={res.popupName}
        className="img-fluid"
        style={{ height: '20%', height : '150px', width: '100%', objectFit: 'cover' }}
      />
      <div
        className="card-body d-flex flex-column justify-content-between"
        style={{ padding: '0.75rem' }}
      >
        <div>
          <h6 className="card-title mb-1 text-dark">{res.popupName}</h6>
          <p className="card-text mb-0" style={{fontSize : '12px', color: '#795548'}}>{reserveDateTime}</p>
          <p className="card-text text-muted small mb-0">
            {res.location}
          </p>
        </div>
        <button className="btn btn-outline-secondary btn-sm w-100 mt-1"
          onClick={() => (navigate(`/popup/detail/${res.popupId}`))}
        >
          예약 상세 보기
        </button>
      </div>
    </div>
  );
}

// 홈 화면
export default function Home() {
  
  const [mostlikedpopup, setMostlikedPopup] = useState(null);
  const [upcomingReservation, setUpcomingReservation] = useState(null);

useEffect(() => {
  axiFetchMostLikedPopup().then(data => {
    setMostlikedPopup(data);
  });

  axiFetchUpcomingReservation().then(data => {
    setUpcomingReservation(data);
  });
}, []); // 빈 배열 추가

  return (
    <div className="container py-4" style={{ maxWidth: '390px', marginTop : '0px', marginBottom : '60px' }}>
      {/* 섹션1: 상단 찜수 1위 카드 */}
      <section>
        {/* <SectionTitle>인기 팝업 1위</SectionTitle> */}
        <PopupCard popup={mostlikedpopup} />
      </section>

      {/* 섹션2: 하단 내 예약 카드 */}
      <section>
        <h2 className="h5 border-bottom pb-2 mb-3 text-secondary" style={{ marginTop: '50' }}>
            곧 만날 예약
        </h2>
        <ReservationCard res={upcomingReservation} />
      </section>
    </div>
  );
}