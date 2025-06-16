import axi from '../utils/axios/Axios'

// 지금 가장 뜨겁게 주목받는 팝업
export async function axiFetchMostLikedPopup(){
    const res = await axi.get('/api/home/most-liked');
    const data = res.data;
    console.log("axiFetchMostLikedPopup() 의 response 입니다~ : " + JSON.stringify(data));
    return {
        popupId:       data.popupId,
        popupName:     data.popupName,
        imageUrl:      data.imageUrl,
        likeCount:     data.likeCount,
    }
}

// 내 예약
export async function axiFetchUpcomingReservation() {
    const res = await axi.get('/api/home/upcoming-reservation');
    const data = res.data;
    console.log("axiFetchMyReservations() 의 response 입니다~ : " + JSON.stringify(data));
    console.log(data.popupId);

    return {
        reserveId: data.reserveId,
        reserveDate: data.reserveDate,
        reserveTime: data.reserveTime,
        reservationState: data.reservationState,
        reservationType: data.reservationType,
        popupId: data.popupId,
        popupName: data.popupName,
        imageUrl: data.imageUrl,
        location: data.location
    };
}