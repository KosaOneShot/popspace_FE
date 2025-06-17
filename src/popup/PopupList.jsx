// PopupList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiUpdatePopupLike, axiFetchPopupList } from './popupAxios';
import CalendarModal from '../components/modal/CalenderModal';

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
              textOverflow: 'ellipsis',
              width: '120px'
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
  const [date, setDate]       = useState('');
  const [search, setSearch]   = useState('');
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
      const list = await axiFetchPopupList(search, date, sortKey); // cursor 파라미터 X
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
        search,
        date,
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
    if (date) {
      axiFetchPopupList(search, date, sortKey).then(setPopupList);
    } else {
      // 날짜가 비어있으면 초기화
      axiFetchPopupList('', '', sortKey).then(setPopupList);
    }
  }, [date])
  
  return (  
    <div ref={containerRef}
      className="container" style={{ paddingTop: '70px', marginBottom: '100px', height: 'calc(100vh - 140px)', overflowY : 'auto' }}>

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
              value={date}
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
              value={search}
              onChange={e => setSearch(e.target.value)}
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
              axiFetchPopupList(search, date, sortKey).then(list => {
                setPopupList(list);
              });
            }}
            style={{ flex: 1, backgroundColor: '#f8ac0b', color: 'white' }}
          >
            검색
          </button>
          <button
            className="btn"
            onClick={() => {
              setSearch('');
              setDate('');
              axiFetchPopupList('', '', sortKey).then(list => {
                setPopupList(list);
              });
            }}
            style={{ flex: 1, backgroundColor: '#1D9D8B', color: 'white' }}
          >
            초기화
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
            axiFetchPopupList(search, date, key).then(setPopupList);
          }}
          style={{ width: '120px', marginBottom: '10px' }}
        >
          <option value="newest">최신순</option>
          <option value="mostLiked">인기순</option>
        </select>        
      </div>

      <CalendarModal show={showCal} date={date} onClose={() => setShowCal(false)} onApply={d => setDate(d)} />

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