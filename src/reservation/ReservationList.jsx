// PopupPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReservationList } from './ReservationAxios';
import CalendarModal from '../components/modal/CalenderModal';

// 카테고리별 색상
const CATEGORY = {
  ALL:     { label: '전체' },
  ADVANCE: { label: '사전예약' },
  'WALK-IN': { label: '현장웨이팅' }
};

// 팝업 카드 컴포넌트
// 팝업 카드 컴포넌트
function ReservationCard({ item }) {
  const navigate = useNavigate();
  console.log(item);
  
  const isPast = checkIsPast(item.reserveDate, item.reserveHour);
  const isWaiting = item.category === 'WALK-IN';

  return (
    <div
      className="card mb-1 position-relative"
      style={{
        border: '2px solidrgb(225, 225, 225)',
        height: '90px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: isPast ? '#f0f0f0' : '#fff'  // ← 여기가 핵심
      }}
      onClick={() => navigate(`/reservation/detail/${item.id}`)}
    >
      {isWaiting && (
        <span
          className="badge"
          style={{
            position: 'absolute',
            bottom: 8,
            right: 4,
            backgroundColor: '#8250DF',
            color: '#fff',
            fontSize: '0.6rem',
            padding: '3px 6px',
            borderRadius: '8px'
          }}
        >
          웨이팅
        </span>
      )}

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
                fontWeight: 600,
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
              <i className="bi bi-geo-alt" style={{ color: '#e74c3c' }}></i>{' '}
              {item.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 지나간 팝업인지 확인 (회색으로 처리)
// dateStr : "YYYY-MM-DD"
// hour : 0~23 또는 '-'
const checkIsPast = (dateStr, hour) => {
  const now = new Date();
  const todayOnly   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Date 형식으로 변환
  const [y, m, d]    = dateStr.split('-').map(Number);
  const reserveDate  = new Date(y, m - 1, d);

  if (reserveDate < todayOnly) return true;
  if (reserveDate.getTime() === todayOnly.getTime()) {
    // 예약 시간이 "-" 이거나 현재 시각보다 앞서면 과거
    if (hour === '-' || Number(hour) < now.getHours()) {
      return true;
    }
  }
  return false; // 미래 예약
};


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
  const params = {
    searchKeyword,
    searchDate,
    lastReserveDate: null,
    lastReserveId:   null,
  };
  if (reservationType !== 'ALL') {
    params.reservationType = reservationType;
  }

  fetchReservationList(params)
    .then(list => {
      setReservationList(list);
      if (list.length) {
        const last = list[list.length - 1];
        setLastReserveDate(last.reserveDate);
        setLastReserveId(last.id);
      }
    })
    .finally(() => setIsLoading(false));
};

// loadMore 함수
const loadMore = () => {
  if (isLoading) return;
  setIsLoading(true);

  const params = {
    searchKeyword,
    searchDate,
    lastReserveDate,
    lastReserveId,
  };
  if (reservationType !== 'ALL') {
    params.reservationType = reservationType;
  }

  fetchReservationList(params)
    .then(list => {
      if (!list || list.length === 0) return;
      setReservationList(prev => [
        ...prev,
        ...list.filter(i => !prev.some(o => o.id === i.id))
      ]);
      const last = list[list.length - 1];
      setLastReserveDate(last.reserveDate);
      setLastReserveId(last.id);
    })
    .catch(err => console.error('예약 목록 로드 중 오류 발생:', err))
    .finally(() => setIsLoading(false));
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


  // 날짜값 변경시 검색
  useEffect(() => {
    fetchReservationList({
      searchKeyword,
      searchDate,
      reservationType,
      lastReserveDate:    null,
      lastReserveHour:    null,
      lastReserveMinute:  null,
      lastReserveId:      null
    }).then(list => {
      setReservationList(list);
      if (list.length) {
        const last = list[list.length - 1];
        setLastReserveDate(last.reserveDate);
        setLastReserveHour(last.reserveHour);
        setLastReserveMinute(last.reserveMinute);
        setLastReserveId(last.id);
      }
    }
    ).catch(err => {
      console.error('예약 목록 로드 중 오류 발생:', err);
      setReservationList([]); // 오류 발생 시 목록 초기화
    }
    );
  }, [searchDate]); // 빈 배열로 의존성 설정하여 최초 한 번만 실행

  return (
    <div ref={containerRef} className="container pt-0 pb-0" style={{ marginTop: '70px', height: 'calc(100vh - 160px)', marginBottom: '90px', overflowY: 'auto', overflowX:   'hidden' }}>
        <div
                className="mb-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 70px',  // 왼쪽은 남은 공간, 오른쪽은 100px 고정
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
                  style={{ height: '100%', width: '40px' }}
                >
                  {/* 검색 버튼 */}
                  <button
                    className="btn icon-btn d-flex justify-content-center align-items-center"
                    onClick={() => {
                      // 검색어와 날짜로 예약 목록 조회
                      fetchReservationList({
                        searchKeyword,
                        searchDate,
                        reservationType,
                        lastReserveDate: null,
                        lastReserveHour: null,
                        lastReserveMinute: null,
                        lastReserveId: null
                      }).then(setReservationList);
                    }}
                    style={{ flex: 1 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-0.5 -0.5 16 16"
                      fill="none"
                      stroke="#8250DF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-search"
                      height={23}
                      width={25}
                    >
                      <path d="M1.875 6.875a5 5 0 1 0 10 0 5 5 0 1 0 -10 0" strokeWidth={2} />
                      <path d="m13.125 13.125 -2.71875 -2.71875" strokeWidth={2} />
                    </svg>
                  </button>
                  {/* 초기화 버튼 */}
                  <button
                    className="btn icon-btn d-flex justify-content-center align-items-center"
                    onClick={() => {
                      setSearchKeyword('');
                      setSearchDate('');
                      // axiFetchPopupList('', '', sortKey).then(setPopupList);
                      fetchReservationList({
                        searchKeyword: '',
                        searchDate: '',
                        reservationType,
                        lastReserveDate: null,
                        lastReserveHour: null,
                        lastReserveMinute: null,
                        lastReserveId: null
                      }).then(setReservationList);
                    }}
                    style={{ flex: 1 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      height={24}
                      width={24}
                    >
                      <g id="arrow-reload">
                        <path
                          d="M12 21c-2.31667 0 -4.325 -0.7625 -6.025 -2.2875C4.275 17.1875 3.3 15.2833 3.05 13H5.1c0.23333 1.7333 1.00417 3.1667 2.3125 4.3C8.72083 18.4333 10.25 19 12 19c1.95 0 3.6042 -0.6792 4.9625 -2.0375C18.3208 15.6042 19 13.95 19 12c0 -1.95 -0.6792 -3.60417 -2.0375 -4.9625C15.6042 5.67917 13.95 5 12 5c-1.15 0 -2.225 0.26667 -3.225 0.8 -1 0.53333 -1.84167 1.26667 -2.525 2.2H9v2H3V4h2v2.35c0.85 -1.06667 1.8875 -1.89167 3.1125 -2.475C9.3375 3.29167 10.6333 3 12 3c1.25 0 2.4208 0.2375 3.5125 0.7125 1.0917 0.475 2.0417 1.11667 2.85 1.925s1.45 1.75833 1.925 2.85C20.7625 9.57917 21 10.75 21 12s-0.2375 2.4208 -0.7125 3.5125c-0.475 1.0917 -1.1167 2.0417 -1.925 2.85s-1.7583 1.45 -2.85 1.925C14.4208 20.7625 13.25 21 12 21Z"
                          strokeWidth={1}
                          fill="#000"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="btn-group mb-3" role="group" style={{ width: '100%' }}>
                {Object.entries(CATEGORY).map(([key, cat]) => {
                  const selected = reservationType === key;
                  const bgColor  = selected ? '#8250DF' : '#fff';
                  const txtColor = selected ? '#fff'     : '#929292';
                  const bdColor  = selected ? '#8250DF' : '#929292';

                  return (
                    <button
                      key={key}
                      type="button"
                      className="btn"
                      style={{
                        width: '30%',
                        backgroundColor: bgColor,
                        color:           txtColor,
                        border:          `1px solid ${bdColor}`,
                        fontWeight:      selected ? 600 : 400
                      }}
                      onClick={() => setReservationType(key)}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

        {/* 캘린더 모달 */}
        <CalendarModal
        show={showCal}
        searchDate={searchDate}
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