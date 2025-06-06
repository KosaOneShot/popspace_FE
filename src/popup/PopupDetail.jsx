// src/popup/PopupDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FooterButtons from "./PopupDetailFooter";
import ReviewList from "./ReviewList";
import axi from "../utils/axios/Axios";

const PopupDetail = () => {
  const { popupId } = useParams();
  const [info, setInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 데이터 불러오기 */
  useEffect(() => {
    // if (!popupId) return;
    console.log("여기 왔어요");
    const fetchAll = async () => {
      try {
        const rlResponse = await axi.get("/popup/detail/reserve-like", {
          params: { popupId: Number(popupId) },
        });
        const rlData = rlResponse.data;
        setIsLiked(!!rlData.isPopupLike);
        setReservation(rlData.reservation || null);
      } catch (err) {
        console.error("예약/찜 여부 조회 실패:", err);
      }

      try {
        const irResponse = await axi.get("/popup/detail/info-review", {
          params: { popupId: Number(popupId) },
        });
        const irData = irResponse.data;
        setInfo(irData.popupInfo);
        setReviews(Array.isArray(irData.reviewList) ? irData.reviewList : []);
      } catch (err) {
        console.error("팝업 정보/리뷰 조회 실패:", err);
      }
      setLoading(false);
    };

    fetchAll();
  }, [popupId]);

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100">
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <span>불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="d-flex flex-column vh-100">
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <span>잘못된 팝업 아이디를 요청하셨습니다.</span>
        </div>
      </div>
    );
  }

  // PopupInfoCard 각 줄을 만들 컴포넌트
  const InfoItem = ({ label, children, isBadge }) => (
    <>
      <dt className="col-sm-4 text-muted small">{label}</dt>
      <dd className={`col-sm-8 mb-2 ${isBadge ? "" : "text-muted small"}`}>
        {isBadge ? (<span className="badge bg-warning-subtle text-dark">{children}</span>) : (children)}
      </dd>
    </>
  );

  const PopupInfoCard = ({
    startDate,
    endDate,
    openTime,
    closeTime,
    category,
    location,
    maxReservations,
  }) => (
    <dl className="row g-0" style={{ margin: 0 }}>
      <InfoItem label="기간">
        {new Date(startDate).toLocaleDateString()} ~{" "}
        {new Date(endDate).toLocaleDateString()}
      </InfoItem>
      <InfoItem label="운영 시간">
        {new Date(openTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        - {" "}
        {new Date(closeTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </InfoItem>
      <InfoItem label="카테고리" isBadge>
        {category}
      </InfoItem>
      <InfoItem label="장소">{location}</InfoItem>
      <InfoItem label="최대 인원">{maxReservations}명</InfoItem>
    </dl>
  );

  return (
    <div
      className="d-flex flex-column overflow-hidden"
      style={{ paddingBottom: "100px" /* footer 생각한 하단 여백 */ }}
    >
      {/* 상단 스크롤 영역: 가로 390px로 고정, 중앙 정렬 */}
      <div className="flex-grow-1 overflow-x-hidden overflow-y-auto">
        <div
          className="py-3"
          style={{
            width: "390px",
            margin: "0 auto",
            boxSizing: "border-box",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {/* 팝업명 */}
          <div className="text-center mb-3">
            <h4 className="mb-1">{info.popupName}</h4>
            <hr
              className="mx-auto"
              style={{ width: "60px", borderTop: "2px dashed #ccc" }}
            />
          </div>

          {/* 이미지(정사각형 비율) */}
          <div className="ratio ratio-1x1 mb-2">
            <img
              src={info.imageUrl}
              alt={info.popupName}
              className="img-fluid rounded"
            />
          </div>

          {/* 정보 섹션 */}
          <div className="card shadow-sm rounded-3 mb-4">
            <div className="card-body py-3">
              <PopupInfoCard
                startDate={info.startDate}
                endDate={info.endDate}
                openTime={info.openTime}
                closeTime={info.closeTime}
                category={info.category}
                location={info.location}
                maxReservations={info.maxReservations}
              />
            </div>
          </div>

          {/* 상세 설명 */}
          <h6 className="mb-2">상세 설명</h6>
          <p className="text-secondary" style={{ lineHeight: 1.6 }}>
            {info.description}
          </p>
          <hr className="border border-2 opacity-50 rounded" />

          {/* 리뷰 섹션 */}
          <ReviewList reviews={reviews} />
        </div>
      </div>

      {/* 하단 고정 버튼들 (예약하기 + 찜하기) */}
      <FooterButtons
        isLiked={isLiked}
        reservation={reservation}
        popupId={Number(popupId)}
      />
    </div>
  );
};

export default PopupDetail;