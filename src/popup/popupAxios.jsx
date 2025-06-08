// src/api/popup.js
import axi from '../utils/axios/Axios';

export async function axiUpdatePopupLike(popupId, currentLiked) {
  const response = await axi.post("/popup/detail/like-update");
  console.log("axiUpdatePopupLike() 의 response 입니다~ : " + response.data.isLiked);
  return response.data && typeof response.data.isLiked === "boolean";  
}

// 서버에서 팝업 목록을 가져와 가공하는 함수
export async function axiFetchPopupList() {
  // TODO : 날짜, 제목, 정렬방식 겁색값을 requestParam 으로 보내기
  const res = await axi.get('/popup/list');
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