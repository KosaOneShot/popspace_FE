// src/api/popup.js
import axi from '../utils/axios/Axios';

// 서버에 팝업 찜 상태를 업데이트하는 함수
export async function axiUpdatePopupLike(popupId, toBeState) {
  console.log(" to be : " + toBeState);
  const response = await axi.post("/popup/detail/like-update",
    { popupId, toBeState }
  );
  console.log("axiUpdatePopupLike() 의 response 입니다~ : " + response.data.isLiked);
  return response.data && typeof response.data.isLiked === "boolean";  
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
  const arr = res.data.popupList || [];
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
  const rlResponse = await axi.get(`/popup/detail/reserve-like/${popupId}`);
  const rlData = rlResponse.data;
  console.log("axiFetchPopupDetail() 의 {찜여부} response 입니다~ : " + JSON.stringify(rlData));
  
  // 2) 팝업 상세 + 리뷰 목록
  const irResponse = await axi.get(`/popup/detail/info-review/${popupId}`);
  const irData = irResponse.data;
  console.log("axiFetchPopupDetail() 의 {팝업 상세 + 리뷰 목록} response 입니다~ : " + JSON.stringify(irData));
  
  return {
    isPopupLike:  rlData.isPopupLike,
    popupInfo:    irData.popupInfo,
    reviewList:   Array.isArray(irData.reviewList) ? irData.reviewList : []
  };
}