// PopupList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiUpdatePopupLike, axiFetchPopupList } from './popupAxios';


// 캘린더 모달
function CalendarModal({ show, date, onClose, onApply }) {
  const [tmp, setTmp] = useState(date);
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">날짜 선택</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <input
              type="date"
              className="form-control"
              value={tmp}
              onChange={e => setTmp(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>취소</button>
            <button className="btn btn-primary" onClick={() => { onApply(tmp); onClose(); }}>
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 개별 팝업 카드
function PopupCard({ id, name, period, location, imageUrl, isLiked, onToggle, onCardClick }) {
  const handleCardClick = () => onCardClick(id);
  const handleLike = async e => {
    e.stopPropagation();
    try {
      const updated = await axiUpdatePopupLike(id, !isLiked);
      onToggle(id, updated);
    } catch (err) {
      console.error(err);
    }
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
    axiFetchPopupList(sortKey)
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
    <div className="container pt-0 pb-0" style={{ marginTop: '70px', marginBottom: '90px' }}>
      {/* 필터 바 */}
      <div className="row mb-3 g-2 align-items-center">
        <div className="col-auto">
          <div className="input-group">
            <span className="input-group-text" role="button" onClick={() => setShowCal(true)}>
              📅
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="날짜 선택"
              value={date}
              readOnly
              onClick={() => setShowCal(true)}
              style={{ width: '120px' }}
            />
          </div>
        </div>
        <div className="col-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="제목 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '140px' }}
            />
            <button className="btn btn-warning" onClick={() => {
              // TODO : 검색 값 서버로 넘겨야함.
              axiFetchPopupList().then(list => {
                console.log('Filtering list:', list);
                setPopupList(list);
              });
            }}>
              검색
            </button>
          </div>
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
          <option value="popular">인기순</option>
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