// PopupList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePopupLike } from './popupAxios';

const dummyData = [
  { id: 1, name: '팝업 스토어',    period: '2025-06-01 ~ 2025-06-20', location: '더현대 서울 B1층', imageUrl: 'https://www.meconomynews.com/news/photo/202404/92006_111745_5027.jpg', isLiked: false, likes: 45 },
  { id: 2, name: '블렌더 팝업 스토어', period: '2025-06-05 ~ 2025-06-25', location: '롯데백화점 잠실점 1층', imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202506/01/196c0427-73a1-4141-a71a-6fd06f57b4c0.jpg', isLiked: true,  likes: 78 },
  { id: 3, name: '접시 팝업 스토어',  period: '2025-06-10 ~ 2025-06-30', location: '현대백화점 압구정본점 2층', imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202505/31/3ace029f-92ee-4a3e-a039-0160b5b7c7e3.jpg', isLiked: false, likes: 32 },
  { id: 4, name: '사봉 팝업 스토어',  period: '2025-06-12 ~ 2025-06-28', location: '롯데월드몰 1층',          imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202505/31/1155902f-f4e3-45f9-bc9d-633e5a90d150.png', isLiked: false, likes: 55 },
  { id: 5, name: 'MAC 팝업 스토어',   period: '2025-06-08 ~ 2025-06-22', location: '코엑스 B1층',               imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202505/18/f71b3fbe-1928-4232-982f-3b85e4ee94ab.jpg', isLiked: true,  likes: 68 },
  { id: 6, name: '에스티로더 팝업 스토어', period: '2025-06-15 ~ 2025-06-30', location: '스타필드 하남 2층',    imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath2/202505/31/4867fe00-a3dd-480a-86e6-a437ad33b00b.jpg', isLiked: false, likes: 27 },
  { id: 7, name: '아이캔더 팝업 스토어',  period: '2025-06-18 ~ 2025-07-05', location: '동대문 디자인 플라자',  imageUrl: 'https://imgprism.ehyundai.com/evntCrdInf/imgPath/202505/31/16930fd8-41ff-4c84-acfe-bbe879b4d351.jpg', isLiked: true,  likes: 80 },
];

// 캘린더 모달
function CalendarModal({ show, date, onClose, onApply }) {
  const [tmp, setTmp] = useState(date);
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ backgroundColor:'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">날짜 선택</h5>
            <button className="btn-close" onClick={onClose}/>
          </div>
          <div className="modal-body">
            <input
              type="date"
              className="form-control"
              value={tmp}
              onChange={e=>setTmp(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>취소</button>
            <button className="btn btn-primary" onClick={()=>{onApply(tmp); onClose()}}>
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// PopupCard 컴포넌트
function PopupCard({
  id, name, period, location, imageUrl,
  isLiked, onToggle, onCardClick
}) {
  const handleCardClick = () => onCardClick(id);
  const handleLike = async e => {
    e.stopPropagation();
    try {
      const newLiked = await updatePopupLike(id, !isLiked);
      onToggle(id, newLiked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card h-100" onClick={handleCardClick} style={{cursor:'pointer'}}>
      <div className="d-flex align-items-center justify-content-center"
           style={{width:'100%', height:'150px', overflow:'hidden'}}>
        <img src={imageUrl} alt={name} style={{maxWidth:'100%', maxHeight:'100%'}}/>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5 className="card-title mb-1"
              style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'120px'}}>
            {name}
          </h5>
          <span role="button" onClick={handleLike}>
            <span className={isLiked ? 'text-danger' : 'text-secondary'}>
              &hearts;
            </span>
          </span>
        </div>
        <p className="card-text mb-1" style={{fontSize:'0.6rem', lineHeight:1, color:'#795548'}}>
          {period}
        </p>
        <p className="card-text mb-1 text-muted" style={{fontSize:'0.8rem', lineHeight:1}}>
          {location}
        </p>
      </div>
    </div>
  );
}

// PopupList 컴포넌트 (기본 export)
export default function PopupList() {
  const navigate = useNavigate();
  const [showCal, setShowCal] = useState(false);
  const [date,    setDate]    = useState('');
  const [search,  setSearch]  = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [items,   setItems]   = useState(dummyData);

  const filterAndSort = () => {
    let res = dummyData;
    if (date)   res = res.filter(i=>new Date(i.period.split('~')[0].trim())>=new Date(date));
    if (search) res = res.filter(i=>i.name.includes(search));
    res = [...res].sort((a,b)=>
      sortKey==='newest'
        ? new Date(b.period.split('~')[0].trim()) - new Date(a.period.split('~')[0].trim())
        : (b.likes||0) - (a.likes||0)
    );
    setItems(res);
  };

  const toggleFav = (id, newLiked) => {
    setItems(items.map(i=>i.id===id?{...i, isLiked:newLiked}:i));
  };

  const handleCardClick = id => {
    navigate(`/detail/${id}`);
  };

  return (
     <div className="container pt-0 pb-0" style={{marginTop:'70px', marginBottom:'90px'}}>
      {/* 필터 바 */}
      <div className="row mb-3 g-2 align-items-center">
        <div className="col-auto">
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
              style={{ width: '129px' }}
            />
            <button className="btn btn-warning" onClick={filterAndSort}>
              검색
            </button>
          </div>
      </div>
        
      </div>

      {/* 정렬 */}
      <div className="row">
        <div className="col"/>
        <div className="col-auto">
          <select className="form-select" value={sortKey}
                  onChange={e=>setSortKey(e.target.value)}
                  style={{width:'120px', marginBottom:'10px'}}>
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </div>

      <CalendarModal show={showCal} date={date}
                     onClose={()=>setShowCal(false)}
                     onApply={d=>setDate(d)} />

      {/* 카드 그리드: 한 줄에 2개 */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3">
        {items.map(item => (
          <div key={item.id} className="col">
            <PopupCard
              {...item}
              onToggle={toggleFav}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}