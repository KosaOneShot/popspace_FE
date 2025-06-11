// src/api/popup.js
import axi from '../utils/axios/Axios';

// 서버에 팝업 찜 상태를 업데이트하는 함수
export async function axiUpdatePopupLike(popupId, toBeState) {
  console.log("토글할 상태:", toBeState);
  const response = await axi.post("/popup/like-update", { popupId, toBeState });
  console.log("서버 응답 status:", response.status);
  if (response.status === 200) return !toBeState;
  throw new Error(`찜 상태 업데이트 실패: ${response.status}`);
}

// 서버에서 팝업 목록을 가져와 가공하는 함수
export async function axiFetchPopupList(searchKeyword, searchDate, sortKey) {
  console.log("searchKeyword : " + searchKeyword,  "searchDate : " + searchDate,  "sortKey : " + sortKey);
  const params = {};
  if (searchKeyword) params.searchKeyword = searchKeyword;
  if (searchDate)    params.searchDate    = searchDate;
  if (sortKey)       params.sortKey       = sortKey;
  
  const res = await axi.get('/popup/list', { params });
  const arr = res.data || [];
  console.log("axiFetchPopupList() 의 response 입니다~ : " + JSON.stringify(arr));
  return arr.map(item => ({
    id:       item.popupId,
    name:     item.popupName,
    period:   `${item.startDate.split(' ')[0]} ~ ${item.endDate.split(' ')[0]}`,
    location: item.location,
    imageUrl: item.imageUrl,
    isLiked:  item.likeState
  }));
}




// 서버에서 팝업 상세 정보를 가져와 가공하는 함수 (성공)
export async function axiFetchPopupDetail(popupId) {
  // 1) 찜여부
  const rlResponse = await axi.get(`/popup/like/${popupId}`);
  const { liked } = rlResponse.data;

  // 2) 팝업 상세
  const irResponse = await axi.get(`/popup/detail/${popupId}`);
  const info = irResponse.data;
  console.log("data : ", info);
  
  // 3) 리뷰 목록
  const reviewResponse = await axi.get(`/popup/review/${popupId}`);
  const reviewData = reviewResponse.data || [];
  console.log("reviewData : ", reviewData);

  // 팝업 정보는 첫 번째 객체에서 뽑고
  const popupInfo = {
    popupId:          info.popupId,
    popupName:        info.popupName,
    imageUrl:         info.imageUrl,
    startDate:        info.startDate,
    endDate:          info.endDate,
    openTime:         info.openTime,
    closeTime:        info.closeTime,
    category:         info.category,
    location:         info.location,
    maxReservations:  info.maxReservations,
    description:      info.description
  };
  
  // 리뷰 목록은 reviewData에서 가공
  const reviewList = reviewData.map(review => ({
    reviewId:   review.reviewId,
    rating:     review.rating,
    content:    review.content,
    createdAt:  review.createdAt
  }));

  return {
    isPopupLike: liked,
    popupInfo,
    reviewList
  };
}``