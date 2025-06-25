// PopupList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiUpdatePopupLike, axiFetchPopupList } from './popupAxios';
import CalendarModal from '../components/modal/CalenderModal';
import '../components/SearchButton.css'; // 검색 버튼 스타일

// 개별 팝업 카드
function PopupCard({ popupId, name, period, location, imageUrl, isLiked, onToggle, onCardClick }) {
  const handleCardClick = () => onCardClick(popupId);
  const handleLike = e => {
    e.stopPropagation();
    const nextState = !isLiked;
    // 1) UI 즉시 업데이트
    onToggle(popupId, nextState);
    // 2) 서버 호출, 실패하면 롤백
    axiUpdatePopupLike(popupId, nextState).catch(err => {
      console.error('찜 업데이트 실패:', err);
      onToggle(popupId, isLiked);  // 원래 상태로 복구
    });
  };

  return (
    <div className="card h-100" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: '100%', height: '150px', overflow: 'hidden' }}
      >
        <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5
            className="card-title mb-1"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              // textOverflow: 'ellipsis',
              width: '120px',
              fontSize : '1rem',
            }}
          >
            {name}
          </h5>
          <span role="button" onClick={handleLike}>
            <span className={isLiked ? 'text-danger' : 'text-secondary'}>&hearts;</span>
          </span>
        </div>
        <p className="card-text mb-1 text-muted" style={{ fontSize: '0.6rem', lineHeight: 1 }}>
          {period}
        </p>
        <p className="card-text mb-1" style={{ fontSize: '0.8rem', lineHeight: 1, color: '#795548' }}>
          <i className="bi bi-geo-alt" style={{color: '#e74c3c'}}></i> {location}
        </p>
      </div>
    </div>
  );
}

// 팝업 목록 전체
export default function PopupList() {
  const containerRef = useRef(null); // 스크롤 컨테이너 참조
  const navigate = useNavigate();
  const [showCal, setShowCal] = useState(false);
  const [searchDate, setSearchDate]       = useState('');
  const [searchKeyword, setSearchKeyword]   = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [popupList, setPopupList]     = useState([]);
  // 페이지네이션 (무한스크롤)
  const [lastEndDate,   setLastEndDate]   = useState(null);
  const [lastLikeCnt,  setLastLikeCnt]   = useState(null);
  const [lastPopupId,   setLastPopupId]   = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 중복 로딩 방지 상태값

  /** 1) 첫 마운트-중복 호출 방지용 ref */
  const firstFetchDone = useRef(false);

  /** 2) 첫 페이지 전용 함수(커서 파라미터 없이 요청) */
  const fetchFirstPage = async () => {
    setIsLoading(true);
    try {
      const list = await axiFetchPopupList(searchKeyword, searchDate, sortKey); // cursor 파라미터 X
      setPopupList(list);
      if (list.length) {
        const last = list[list.length - 1];
        setLastEndDate(last.endDate);
        setLastPopupId(last.popupId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** 3) 무한 스크롤 페이지네이션(커서 포함) */
  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const list = await axiFetchPopupList(
        searchKeyword,
        searchDate,
        sortKey,
        lastEndDate,   // null ⇒ 자동 제외
        lastPopupId
      );
      if (!list.length) return;
      setPopupList(prev =>
        prev.concat(list.filter(n => !prev.some(o => o.popupId === n.popupId)))
      );
      const last = list[list.length - 1];
      setLastEndDate(last.endDate);
      setLastPopupId(last.popupId);
    } finally {
      setIsLoading(false);
    }
  };

  /** 4) 초기 로딩 ─ StrictMode 중복 실행 무시 */
  useEffect(() => {
    if (firstFetchDone.current) return;
    firstFetchDone.current = true;

    // 상태 초기화
    setPopupList([]);
    setLastEndDate(null);
    setLastPopupId(null);

    fetchFirstPage();
  }, [sortKey]); // sortKey 바뀌면 새로 로드


  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const onScroll = () => {
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50) { // 스크롤이 끝까지 도달했는지 확인
      loadMore();
    }
  };
  el.addEventListener('scroll', onScroll);
  return () => el.removeEventListener('scroll', onScroll);
}, [loadMore]);


  const toggleFav = (popupId, newLiked) => {
    setPopupList(popupList.map(i => i.popupId === popupId ? { ...i, isLiked: newLiked } : i));
  };

  const handleCardClick = popupId => {
    // navigate(`/detail/${popupId}`);
    navigate(`/popup/detail/${popupId}`);
  };
  
  useEffect(() => {
    // 날짜가 변경되면 팝업 목록을 새로 불러옴
    if (searchDate) {
      axiFetchPopupList(searchKeyword, searchDate, sortKey).then(setPopupList);
    } else {
      // 날짜가 비어있으면 초기화
      axiFetchPopupList('', '', sortKey).then(setPopupList);
    }
  }, [searchDate])
  
  return (  
    <div ref={containerRef}
      className="container" 
      style={{ paddingTop: '70px', marginBottom: '73px', overflowY : 'auto', overflowX : 'hidden', height: 'calc(100vh)' }}>

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
          <button
            className="btn icon-btn d-flex justify-content-center align-items-center"
            onClick={() => {
              axiFetchPopupList(searchKeyword, searchDate, sortKey).then(setPopupList);
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
              className="feather feather-searchKeyword"
              height={23}
              width={25}
            >
              <path d="M1.875 6.875a5 5 0 1 0 10 0 5 5 0 1 0 -10 0" strokeWidth={2} />
              <path d="m13.125 13.125 -2.71875 -2.71875" strokeWidth={2} />
            </svg>
          </button>

          <button
            className="btn icon-btn d-flex justify-content-center align-items-center"
            onClick={() => {
              setSearchKeyword('');
              setSearchDate('');
              axiFetchPopupList('', '', sortKey).then(setPopupList);
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

      {/* 정렬 */}
      <div className=' d-flex justify-content-end'>
        <select
          className="form-select"
          value={sortKey}
          onChange={e => {
            const key = e.target.value;
            setSortKey(key);
            axiFetchPopupList(searchKeyword, searchDate, key).then(setPopupList);
          }}
          style={{ width: '120px', marginBottom: '10px' }}
        >
          <option value="newest">최신순</option>
          <option value="mostLiked">인기순</option>
        </select>        
      </div>

      <CalendarModal show={showCal} searchDate={searchDate} onClose={() => setShowCal(false)} onApply={d => setSearchDate(d)} />

      {/* 목록 또는 없음 메시지 */}
      {popupList == null || popupList.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          검색된 팝업이 없습니다.
        </div>
      ) : (
      <div className="row row-cols-2 g-3">
        {popupList.map(item => (
          <div key={item.popupId} className="col">
            <PopupCard
              {...item}
              onToggle={toggleFav}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </div>
      )}
    </div>
  );
}