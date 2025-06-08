// PopupPage.jsx
import React, { useState, useMemo } from 'react';

// 카테고리별 색상
const CATEGORY = {
  전체:     { label: '전체',     color: '#795548' },
  사전예약:  { label: '사전예약',  color: '#DB9506' },
  현장웨이팅: { label: '현장웨이팅', color: '#1D9D8B' }
};

// popupList.jsx 와 동일한
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

// 더미 데이터
const dummyData = [
  {
    id: 1,
    title:    '하늘아카시아 팝업',
    datetime: '2025년 5월 1일 18:00',
    location: '롯데백화점 대구점 B2 입구행사장',
    imageUrl: 'https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202505/29/2932339c-cfdd-4945-a664-7c876e3003e4.jpg',
    category: '사전예약'
  },
  {
    id: 2,
    title:    '젠틀몬스터 X 브랏츠 포켓 컬렉션 팝업',
    datetime: '2025년 4월 10일 19:00',
    location: '신세계백화점 강남점 지하1층',
    imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202506/01/196c0427-73a1-4141-a71a-6fd06f57b4c0.jpg',
    category: '사전예약'
  },
  {
    id: 3,
    title:    '소보로에 진심을 담은 베이커리',
    datetime: '2025년 6월 10일 12:00',
    location: '롯데백화점 건대스타시티점 B1F 식품행사장',
    imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202505/31/3ace029f-92ee-4a3e-a039-0160b5b7c7e3.jpg',
    category: '현장웨이팅'
  },
  {
    id: 4,
    title:    '세븐틴 X 비비고 팝업 IN 명동',
    datetime: '2025년 6월 10일 14:00',
    location: '현대백화점 명동점 1F',
    imageUrl: 'https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202505/29/2932339c-cfdd-4945-a664-7c876e3003e4.jpg',
    category: '현장웨이팅'
  }
];


// 팝업 카드 컴포넌트
function ReservationCard({ item }) {
  const borderColor = CATEGORY[item.category].color;
  return (
    <div
      className="card mb-1"
      style={{
        border: `2px solid ${borderColor}`,
        height: '90px',
        overflow: 'hidden'
      }}
    >
      <div className="row g-0 h-100 align-items-center">
        <div className="col-3" style={{ height: '90px', overflow: 'hidden' }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '90%', height: '100%', objectFit: 'cover' }}
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
              {item.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ReservationCard 컴포넌트 (PopupCard와 동일한 형식)
function ReservationCard2({ item }) {
  const borderColor = CATEGORY[item.category].color;
  return (
    <div className="card" style={{ border: `2px solid ${borderColor}` }}>
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text mb-1">{item.datetime}</p>
        <p className="card-text text-muted">{item.location}</p>
      </div>
    </div>
  );
}

// 전체 페이지
export default function PopupPage() {
  const [date,    setDate]    = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('전체');
  const [showCal, setShowCal] = useState(false);
  const [reservationList, setReservationList] = useState(dummyData);

  return (
    <div className="container pt-0 pb-0" style={{ marginTop: '70px', marginBottom: '90px' }}>
        {/* 달력 + 검색 */}
        <div className="row mb-3 g-2 align-items-center">
        <div className="col-auto">
            <div className="input-group">
            <span className="input-group-text" role="button"
                onClick={() => setShowCal(true)}
            >📅</span>
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
            <button
                className="btn btn-warning"
                onClick={() => {
                axiFetchPopupList().then(list => {
                    console.log('Filtering list:', list);
                    setPopupList(list);
                });
                }}
            >검색</button>
            </div>
        </div>
        </div>

        {/* 정렬 */}
        <div className="d-flex justify-content-end mb-3">
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
            style={{ width: '120px' }}
        >
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
        </select>
        </div>

        {/* TODO :카테고리 선택 버튼 (한번에 1개만 선택 가능) */}
        <div className="btn-group mb-3" role="group" style={{ width: '100%' }}>
            {Object.values(CATEGORY).map(cat => (
                <button
                    key={cat.label}
                    type="button"
                    className={`btn ${filter === cat.label ? 'btn-light' : 'btn-outline-light'}`}
                    style={{
                        borderColor:     cat.color,
                        backgroundColor: filter === cat.label ? cat.color : '#fff',
                        color:           filter === cat.label ? '#fff' : cat.color
                    }}
                    onClick={() => setFilter(cat.label)}
                    >
                    {cat.label}
                </button>
            ))}
        </div>

        {/* 캘린더 모달 */}
        <CalendarModal
        show={showCal}
        date={date}
        onClose={() => setShowCal(false)}
        onApply={d => setDate(d)}
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
                <ReservationCard item={item} />
            </div>
            ))}
        </div>
        )}
    </div>
    
  );
}