// PopupPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReservationList } from './ReservationAxios';
import CalendarModal from '../components/modal/CalenderModal';

// 카테고리별 색상
const CATEGORY = {
  ALL:        { label: '전체', color: '#795548' },
  ADVANCE:   { label: '사전예약', color: '#f8ac0b' },
  WALK_IN:    { label: '현장웨이팅', color: '#1D9D8B' }
};

// 팝업 카드 컴포넌트
function ReservationCard({ item }) {
  const navigate = useNavigate();          // useNavigate 훅
  const borderColor = CATEGORY[item.category]?.color || '#CCC'; // fallback color

  const handleCardClick = () => {
    console.log('카드 클릭:',  `/reservation/detail/${item.id}`)
    navigate(`/reservation/detail/${item.id}`); // 예약 상세 페이지로 이동
  };

  return (
    <div
      className="card mb-1"
      style={{
        border: `2px solid ${borderColor}`,
        height: '90px',
        overflow: 'hidden',
        cursor: 'pointer'                   // 클릭 가능 커서
      }}
      onClick={handleCardClick}             // 카드 전체 클릭 바인딩
    >
      <div className="row g-0 h-100 align-items-center">
        <div className="col-3" style={{ height: '90px', overflow: 'hidden' }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="col-9">
          <div className="card-body p-2" style={{ height: '90px' }}>
            <h6
              className="card-title mb-2"
              style={{
                fontWeight: '600',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {item.title}
            </h6>
            <p
              className="card-text mb-1"
              style={{
                color: '#795548',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {item.datetime}
            </p>
            <p
              className="card-text text-muted mb-0"
              style={{
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
             <i className="bi bi-geo-alt" style={{color: '#e74c3c'}}></i> {item.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 전체 페이지
export default function ReservationList() {
  const containerRef = useRef(null); // 스크롤 컨테이너 참조
  const [searchKeyword,    setSearchKeyword]    = useState('');
  const [searchDate,       setSearchDate]       = useState('');
  const [reservationType, setReservationType] = useState('ALL');
  const [reservationList,  setReservationList]  = useState([]);
  const [showCal, setShowCal] = useState(false);
  // 페이지네이션
  const [lastReserveDate, setLastReserveDate] = useState(null);
  const [lastReserveHour, setLastReserveHour] = useState(null);
  const [lastReserveMinute, setLastReserveMinute] = useState(null);
  const [lastReserveId, setLastReserveId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

const fetchFirstPage = () => {
  setIsLoading(true);
  fetchReservationList({
    searchKeyword,
    searchDate,
    reservationType,
    lastReserveDate:    null,
    lastReserveHour:    null,
    lastReserveMinute:  null,
    lastReserveId:      null
  })
  .then(list => {
    setReservationList(list);
    if (list.length) {
      const last = list[list.length - 1];
      setLastReserveDate(last.reserveDate);
      setLastReserveHour(last.reserveHour);
      setLastReserveMinute(last.reserveMinute);
      setLastReserveId(last.id);
    }
  })
  .finally(() => setIsLoading(false));
};

  const loadMore = () => {
    if (isLoading) return; // 중복 로딩 방지
    setIsLoading(true);
    fetchReservationList({
      searchKeyword,
      searchDate,
      reservationType,
      lastReserveDate,
      lastReserveHour,
      lastReserveMinute,
      lastReserveId
    })
      .then(list => {
        if (!list || list.length === 0) return;
        // 중복 제거하며 누적
        setReservationList(prev => [...prev, ...list.filter(newItem => !prev.some(old => old.id === newItem.id))]);
        const last = list[list.length - 1];
        setLastReserveDate(last.reserveDate);
        setLastReserveHour(last.reserveHour);
        setLastReserveMinute(last.reserveMinute);
        setLastReserveId(last.id);
      })
      .catch(err => console.error('예약 목록 로드 중 오류 발생:', err))
      .finally(() => setIsLoading(false)); // 로딩 상태 해제
  };

  useEffect(() => {
    // 초기 목록 로딩
    setReservationList([]); // 기존 목록 초기화
    setLastReserveDate(null);
    setLastReserveHour(null);
    setLastReserveMinute(null);
    setLastReserveId(null);
    
    fetchFirstPage(); // 초기 로드
  }, [reservationType]);

// 페이지네이션 감지 및 스크롤 이벤트 핸들러
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const handleScroll = () => {
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50) {
      loadMore(); // 스크롤이 바닥에 가까워지면 추가 로드
    }
  };
  el.addEventListener('scroll', handleScroll);
  return () => {
    el.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 이벤트 제거
  };
}, [loadMore]);

  return (
    <div ref={containerRef} className="container pt-0 pb-0" style={{ marginTop: '70px', height: 'calc(100vh - 160px)', marginBottom: '90px', overflowY: 'auto' }}>
        <div
                className="mb-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px',  // 왼쪽은 남은 공간, 오른쪽은 100px 고정
                  columnGap: '8px',
                  width: '390px',
                  margin: '0 auto',
                }}
              >
                {/* 좌측: 입력 필드 두 개 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* 1행: 날짜 선택 */}
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      role="button"
                      onClick={() => setShowCal(true)}
                    >
                      📅
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="날짜 선택"
                      value={searchDate}
                      readOnly
                      onClick={() => setShowCal(true)}
                    />
                  </div>
        
                  {/* 2행: 제목 검색 */}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="제목 검색"
                      value={searchKeyword}
                     onChange={e => setSearchKeyword(e.target.value)}
                    />
                  </div>
                </div>
        
                {/* 우측: 세로로 붙은 버튼 그룹 */}
                <div
                  className="btn-group-vertical"
                  role="group"
                  style={{ height: '100%' , width : '80px'}}
                >
                  <button
                    className="btn"
                    onClick={() => {
                      console.log('검색 버튼 클릭:', { searchKeyword, searchDate, reservationType });
                      fetchReservationList({searchKeyword, searchDate, reservationType}).then(list => {
                        setReservationList(list);
                      });
                    }}
                    style={{ flex: 1, backgroundColor: '#f8ac0b', color: 'white' }}
                  >
                   검색 
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      setSearchKeyword('');
                      setSearchDate('');
                      setReservationType('ALL'); // 초기화 시 전체로 설정
                      fetchReservationList({ searchKeyword, searchDate, reservationType }).then(list => {
                        setReservationList(list);
                      });
                    }}
                    style={{ flex: 1, backgroundColor: '#1D9D8B', color: 'white' }}
                  >
                    초기화
                  </button>
                </div>
              </div>

      <div className="btn-group mb-3" role="group" style={{ width: '100%' }}>
        {Object.entries(CATEGORY).map(([key, cat]) => (
          <button
            key={key}
            type="button"
            className={`btn ${reservationType === key ? 'btn-light' : 'btn-outline-light'}`}
            style={{
              width: '30%',
              borderColor:     cat.color,
              backgroundColor: reservationType === key ? cat.color : '#fff',
              color:           reservationType === key ? '#fff' : cat.color
            }}
            onClick={() => setReservationType(key)} // ✅ key: "ADVANCE"
          >
            {cat.label}
          </button>
        ))}
      </div>

        {/* 캘린더 모달 */}
        <CalendarModal
        show={showCal}
        date={searchDate}
        onClose={() => setShowCal(false)}
        onApply={d => setSearchDate(d)}
        />
        {/* 목록 또는 없음 메시지 */}
        {reservationList == null || reservationList.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            예약 내역이 없습니다.
        </div>
        ) : (
        <div className="row">
            {reservationList.map(item => (
            <div key={item.id} className="col-12 mb-3">
              <ReservationCard item={{
                ...item,
              }} />
            </div>
          ))}
        </div>
        )}
    </div>
    
  );
}