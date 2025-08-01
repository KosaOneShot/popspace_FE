// src/api/popup.js
import axi from '../utils/axios/Axios';

// 서버에 팝업 찜 상태를 업데이트하는 함수
export async function axiUpdatePopupLike(popupId, toBeState) {
  console.log("popupId : " + popupId, "toBeState : " + toBeState);
  const response = await axi.post("/api/popup/like-update", { popupId, toBeState });
  console.log("서버 응답 status:", response.status, !toBeState);
  if (response.status === 200) return !toBeState;
  throw new Error(`찜 상태 업데이트 실패: ${response.status}`);
}

// 서버에서 팝업 목록을 가져와 가공하는 함수
export async function axiFetchPopupList(searchKeyword, searchDate, sortKey, lastEndDate, lastPopupId) {
  console.log("searchKeyword : " + searchKeyword,  "searchDate : " + searchDate,  "sortKey : " 
    + sortKey, "lastEndDate : " + lastEndDate,  "lastPopupId : " + lastPopupId );
  const params = {};
  if (searchKeyword) params.searchKeyword = searchKeyword;
  if (searchDate)    params.searchDate    = searchDate;
  if (sortKey)       params.sortKey       = sortKey;
  if (lastEndDate)   params.lastEndDate   = lastEndDate;
  if (lastPopupId)   params.lastPopupId   = lastPopupId;
  
  const res = await axi.get('/api/popup/list', { params });
  const arr = res.data || [];
  console.log("axiFetchPopupList() 의 response 입니다~ : " + JSON.stringify(arr));
  return arr.map(item => ({
    popupId:       item.popupId,
    name:     item.popupName,
    period:   `${item.startDate.split(' ')[0]} ~ ${item.endDate.split(' ')[0]}`,
    endDate: item.endDate,
    location: item.location,
    imageUrl: item.imageUrl,
    isLiked:  item.likeState === 'ACTIVE'
  }));
}

// 찜여부
export async function axiFetchPopupLike(popupId){
  let liked = false;
  let isLogined = true;
  try {
    console.log("팝업 찜 여부 조회 성공");
    const rlResponse = await axi.get(`/api/popup/like/${popupId}`);
    liked = rlResponse.data;
  } catch (e) {
    isLogined = false; // 찜 여부 조회 실패 시 기본값 false 사용
    console.warn("찜 여부 조회 실패: 기본값 false 사용", e);
  }
  console.log("찜, 로그인 여부 : ", liked, isLogined);
  return { isLiked: liked, isLogined };
}



// 서버에서 팝업 상세 정보를 가져와 가공하는 함수 (성공)
export async function axiFetchPopupDetail(popupId) {
  // 2) 팝업 상세
  const irResponse = await axi.get(`/api/popup/detail/${popupId}`);
  const info = irResponse.data;
  console.log("data : ", info);
  
  // 3) 리뷰 목록
  // const reviewResponse = await axi.get(`/api/popup/review/${popupId}`);
  // console.log('??', popupId);
  
  // const reviewResponse = await fetchReviewPage(popupId, 1, 3); // 페이지네이션을 위해 기본값 설정
  // const reviewData = reviewResponse.data || [];
  // console.log("reviewData !!!!!!!!!: ", reviewData);

  // 1) 찜, 로그인 여부
  let liked, isLogined = await axiFetchPopupLike(popupId);

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
  
  // // 리뷰 목록은 reviewData에서 가공
  // const reviewList = reviewData.map(review => ({
  //   reviewId:   review.reviewId,
  //   rating:     review.rating,
  //   content:    review.content,
  //   createdAt:  review.createdAt
  // }));

  return {
    isLogined,
    isPopupLike: liked,
    popupInfo,
    // reviewList
  };
}

/**
 리뷰 - 페이지네이션
 */
export async function fetchReviewPage(popupId, pageNum, pageSize) {
  const response = await axi.get('/api/popup/review', {
    params: {
      popupId : popupId,
      pageNum : pageNum,
      pageSize : pageSize
    }
  });
  return response.data;
}``