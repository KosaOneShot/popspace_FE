// PopupList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiUpdatePopupLike, axiFetchPopupList } from './popupAxios';
import CalendarModal from '../components/modal/CalenderModal';

// 개별 팝업 카드
function PopupCard({ id, name, period, location, imageUrl, isLiked, onToggle, onCardClick }) {
  const handleCardClick = () => onCardClick(id);
  const handleLike = e => {
    e.stopPropagation();
    const nextState = !isLiked;
    // 1) UI 즉시 업데이트
    onToggle(id, nextState);
    // 2) 서버 호출, 실패하면 롤백
    axiUpdatePopupLike(id, nextState).catch(err => {
      console.error('찜 업데이트 실패:', err);
      onToggle(id, isLiked);  // 원래 상태로 복구
    });
  };

  return (
    <div className="card h-100" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: '100%', height: '150px', overflow: 'hidden' }}
      >
        <img src={imageUrl} alt={name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
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
        <p className="card-text mb-1" style={{ fontSize: '0.6rem', lineHeight: 1, color: '#795548' }}>
          {period}
        </p>
        <p className="card-text mb-1 text-muted" style={{ fontSize: '0.8rem', lineHeight: 1 }}>
          {location}
        </p>
      </div>
    </div>
  );
}

// 팝업 목록 전체
export default function PopupList() {
  const navigate = useNavigate();
  const [showCal, setShowCal] = useState(false);
  const [date, setDate]       = useState('');
  const [search, setSearch]   = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [popupList, setPopupList]     = useState([]);

  // 초기 목록 로딩
  useEffect(() => {
    axiFetchPopupList(search, date, sortKey)
      .then(list => setPopupList(list))   // ← 여기를 수정: .then(setPopupList()) X
      .catch(err => console.error('Failed to load popups', err));
  }, [sortKey]);  // sortKey 변경 시마다 다시 호출

  // 
  const toggleFav = (id, newLiked) => {
    setPopupList(popupList.map(i => i.id === id ? { ...i, isLiked: newLiked } : i));
  };

  const handleCardClick = id => {
    // navigate(`/detail/${id}`);
    navigate(`/popup/detail/${id}`);
  };

  return (
    <div className="container" style={{ paddingTop: '70px', marginBottom: '100px', overflowY : 'auto' }}>
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
            style={{ flex: 1, backgroundColor: '#DB9506', color: 'white' }}
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
            axiFetchPopupList(key).then(list => {
              console.log('Filtering list:', list);
              setPopupList(list);
            });
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3">
          {popupList.map(item => (
            <div key={item.id} className="col">
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