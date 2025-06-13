import axi from '../utils/axios/Axios';
import { formatDate, formatTime, formatDateTime } from '../utils/TimeFormat';

// 예약 목록 조회
export async function fetchReservationList({ searchKeyword, searchDate, reservationType } = {}) {
  console.log('예약 목록 조회 파라미터:', { searchKeyword, searchDate, reservationType });
  try {
    const response = await axi.get('/api/reservation/list', {
      params: { 
        searchKeyword : searchKeyword, 
        searchDate : searchDate, 
        reservationType : reservationType }
    });
    console.log('예약 목록 조회 응답:', response.data);
    const list =  response.data.map(item => ({
      id: item.reserveId,
      title: item.popupName,
      datetime: formatDateTime(item.reserveDate + ' ' + item.reserveTime),
      location: item.location,
      imageUrl: item.imageUrl,
      category: item.reservationType
    }));
    console.log('가공된 예약 목록:', list);
    return list;
  } catch (error) {
    console.error('예약 리스트 조회 중 오류 발생:', error);
    return [];
  }
}
// 예약 QR 조회 /api/qr/{reserveId}
export async function fetchReservationQR(reserveId) {
  console.log('예약 QR 조회 ID:', reserveId);
  try {
    const response = await axi.get(`/api/qr/${reserveId}`, {
      responseType: 'blob'
    });
    console.log('예약 QR 조회 응답:', response.data);
    const url = URL.createObjectURL(response.data);
    return url; // <img src={url} 으로 사용
  } catch (error) {
    console.error('예약 QR 조회 중 오류 발생:', error);
    return null;
  }
}


// 예약 상세 조회
export async function fetchReservationDetail(reserveId) {
  console.log('예약 상세 조회 ID:', reserveId);
  try {
    const response = await axi.get(`/api/reservation/detail/${reserveId}`);
    console.log('예약 상세 조회 응답:', response.data);
    const detail = response.data;
    return {
      reserveId: detail.reserveId,
      reserveDate: detail.reserveDate,
      reserveTime: detail.reserveTime,
      createdAt: detail.createdAt,
      canceledAt: detail.canceledAt,
      reservationState: detail.reservationState,
      reservationType: detail.reservationType,
      popupId: detail.popupId,
      memberName: detail.memberName,
      popupName: detail.popupName,
      location: detail.location,
      startDate: detail.startDate,
      endDate: detail.endDate,
      openTime: detail.openTime,
      closeTime: detail.closeTime,
      category: detail.category,
      maxReservations: detail.maxReservations,
      imageUrl: detail.imageUrl,
      description: detail.description
    };
  } catch (error) {
    console.error('예약 상세 조회 중 오류 발생:', error);
    return null;
  }
}