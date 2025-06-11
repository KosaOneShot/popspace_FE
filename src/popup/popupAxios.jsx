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
export async function axiFetchPopupList(searchKeyword=null, searchDate=null, sortKey=null) {
  // TODO : 날짜, 제목, 정렬방식 겁색값을 requestParam 으로 보내기
  console.log("searchKeyword : " + searchKeyword,  "searchDate : " + searchDate,  "sortKey : " + sortKey);
  const res = await axi.get('/popup/list',
    {
      params: {
        searchKeyword : searchKeyword,
        searchDate    : searchDate,
        sortKey       : sortKey,
      }
    }
  );
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

  // 2) 팝업 상세 + 리뷰 목록
  const irResponse = await axi.get(`/popup/detail/${popupId}`);
  const data = irResponse.data;
  console.log("data : ", data);
  

  // 팝업 정보는 첫 번째 객체에서 뽑고
  const first = data[0] || {};
  const popupInfo = {
    popupId:        first.popupId,
    popupName:      first.popupName,
    location:       first.location,
    startDate:      first.startDate,
    endDate:        first.endDate,
    openTime:       first.openTime,
    closeTime:      first.closeTime,
    description:    first.description,
    category:       first.category,
    maxReservations:first.maxReservations,
    imageUrl:       first.imageUrl,
    memberId:       first.memberId,
  };

  // 리뷰 리스트는 reviewId가 있는 모든 행에서
  const reviewList = Array.isArray(data)
    ? data.map(r => ({
          reviewId:  r.reviewId,
          rating:    r.rating,
          content:   r.content,
          createdAt: r.createdAt,
        }))
    : [];

  return {
    isPopupLike: liked,
    popupInfo,
    reviewList
  };
}``