// src/popup/PopupDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FooterButtons from "./PopupDetailFooter";
import ReviewList from "./ReviewList";


const PopupDetail = () => {
  const { id } = useParams();
  const [popup, setPopup] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    // fetch(`/api/popup/${id}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setPopup(data.popup);
    //     setReviews(data.reviews);
    //   });

    /* 더미 데이터 */
    const examplePopup = {
      popup_id: 1,
      popup_name: "미션파이브",
      location: "지하1층 대행사장",
      start_date: "2025.05.23",
      end_date: "2025.06.04",
      open_time: "10:00",
      close_time: "22:00",
      description:
        "성수동 핫플레이스 ‘미션 파이브_Never Stop Play!’ 도파민이 폭발하는 디지털 액티비티를 더현대 서울에서 만나보세요!",
      category: "디지털 액티비티",
      max_reservations: 100,
      image_url: "/logo512.png",
    };
    const exampleReviews = [
      {
        review_id: 1,
        rating: 5,
        content: "디지털 AR 체험이 신기했어요. 재밌게 즐겼습니다!",
        created_at: "2025-05-25",
      },
      {
        review_id: 2,
        rating: 4,
        content: "사람이 많았지만 그래도 잘 구성되어 있네요.",
        created_at: "2025-05-27",
      },
    ];

    setPopup(examplePopup);
    setReviews(exampleReviews);
  }, [id]);

  if (!popup) {
    return (
      <div className="d-flex flex-column vh-100 ">
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <span>불러오는 중...</span>
        </div>
      </div>
    );
  }


  const InfoItem = ({ label, children, isBadge }) => (
  <>
    <dt className="col-sm-4 text-muted small">{label}</dt>
    <dd className={`col-sm-${isBadge ? "8" : "8"} mb-2 ${isBadge ? "" : "text-muted small"}`}>
      {isBadge ? <span className="badge bg-warning-subtle text-dark">{children}</span> : children}
    </dd>
  </>
);

const PopupInfoList = ({ startDate, endDate, openTime, closeTime, category, location, maxReservations }) => (
  <dl className="row g-0" style={{margin : 0}}>
    <InfoItem label="기간" >
      {startDate} ~ {endDate}
    </InfoItem>
    <InfoItem label="운영 시간">
      {openTime} - {closeTime}
    </InfoItem>
    <InfoItem label="카테고리" isBadge>
      {category}
    </InfoItem>
    <InfoItem label="장소">
      {location}
    </InfoItem>
    <InfoItem label="최대 인원">
      {maxReservations}명
    </InfoItem>
  </dl>
);

  return (
    // 전체 레이아웃 : overflow-hidden을 사용하여 스크롤바가 나타나지 않도록 설정
    <div className="d-flex flex-column overflow-hidden">
      {/* 상단 헤더 */}
      {/* 스크롤 가능한 컨텐츠 */}
      <div className="flex-grow-1 overflow-auto ">
        <div className="container py-3">
          {/* 팝업명 */}
          <div className="text-center mb-3">
            <h4 className="mb-1">{popup.popup_name}</h4>
            <hr className="mx-auto"
              style={{ width: "60px", borderTop: "2px dashed #ccc" }}
            />
          </div>

          {/* 이미지(정사각형 비율) */}
          <div className="ratio ratio-1x1 mb-2">
            <img
              src={popup.image_url}
              alt={popup.popup_name}
              className="img-fluid rounded"
            />
          </div>
          <div className="text-muted small mb-3">이미지 사진</div>


          {/* 정보 섹션 */}
          <div className="card shadow-sm rounded-3 mb-4">
            <div className="card-body py-3">
              <PopupInfoList
                startDate={popup.start_date}
                endDate={popup.end_date}
                openTime={popup.open_time}
                closeTime={popup.close_time}
                category={popup.category}
                location={popup.location}
                maxReservations={popup.max_reservations}
              />
            </div>
          </div>

          <h6 className="mb-2">상세 설명</h6>
          <p className="text-secondary" style={{ lineHeight: 1.6 }}>
            {popup.description}
          </p>
          <hr class="border border-2 opacity-50 rounded"/>
          {/* 리뷰 섹션 */}
          <ReviewList reviews={reviews} />
        </div>
      </div>

      {/* 하단 고정 버튼들 (예약하기 + 찜하기) */}
      <FooterButtons />
    </div>
  );
};

export default PopupDetail;