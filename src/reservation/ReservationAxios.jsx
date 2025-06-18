import { Contact } from 'lucide-react';
import axi from '../utils/axios/Axios';
import { formatDate, formatTime, formatDateTime } from '../utils/TimeFormat';

// 예약 목록 조회
export async function fetchReservationList({ searchKeyword, searchDate, reservationType, lastReserveDate, lastReserveHour, lastReserveMinute, lastReserveId }) {
  console.log('예약 목록 조회 파라미터:', { searchKeyword, searchDate, reservationType, lastReserveDate, lastReserveHour, lastReserveMinute, lastReserveId });
  try {
    const response = await axi.get('/api/reservation/list', {
      params: { 
        searchKeyword : searchKeyword, 
        searchDate : searchDate, 
        reservationType : reservationType,
        lastReserveDate: lastReserveDate,
        lastReserveHour: lastReserveHour,
        lastReserveId: lastReserveId
       }
    });
    console.log('예약 목록 조회 응답:', response.data);

    const list = response.data.map(item => {
      // reserveTime 안전 분리
      const [reserveHour, reserveMinute] =
        (typeof item?.reserveTime === 'string' && item.reserveTime.includes(':'))
          ? item.reserveTime.split(':').map(Number): ['-', '-'];

      console.log('ReservationAxios - 분리된 예약시간 시, 분:', { reserveHour, reserveMinute });
          
      return {
        id:          item.reserveId,
        title:       item.popupName,
        datetime:    formatDateTime(item.reserveDate + ' ' + (item.reserveTime ?? '')),
        reserveDate: item.reserveDate,
        reserveHour,
        reserveMinute,
        location:    item.location,
        imageUrl:    item.imageUrl,
        category:    item.reservationType,
        reservationStateKor: changeStateToKor(item.reservationState),
        reservationTypeKor: changeTypeToKor(item.reservationType),
      };
    });
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
      reservationStateKor: changeStateToKor(item.reservationState),
      reservationType: detail.reservationType,
      reservationTypeKor: changeTypeToKor(item.reservationType),
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

// 현장 웨이팅 대기 관련 정보 조회
export async function fetchWalkInPreview(popupId) {
  console.log('현장 웨이팅 대기 정보 조회:', popupId);
  try {
    const response = await axi.get(`/api/${popupId}/reservation/total/sequence`);
    const data = response.data;

    return {
      // 현재 대기 순번
      sequence: data.sequence,
      // 평균 대기 시간
      averageWaitTime: data.averageWaitTime,
      // 예상 입장 시간
      entranceTime: data.entranceTime,
    };
  } catch (error) {
    console.error('현장 웨이팅 정보 조회 중 오류 발생:', error);
    return null;
  }
}

// 사전 예약 취소
export async function cancelAdvanceReservation(reserveId){
  const payload = {
    reserveId: Number(reserveId)
  };

  try {
    const res = await axi.post(`/api/reservations/${reserveId}/cancel`, payload);
    return res.data;
  }catch (err) {
    throw err;
  }
}

// 현장 웨이팅 예약 시도
export async function postWalkInReservation(popupId) {
  const payload = {
    popupId: Number(popupId)
  };

  try {
    const res = await axi.post("/api/reservation/walk-in", payload);
    return res.data;
  } catch (err) {
    throw err;
  }
}

function changeStateToKor(reservationState) {
  const reservationStateKor = {
    RESERVED: '예약완료',
    CANCELED: '예약취소',
    CHECKED_IN: '입장',
    CHECKED_OUT: '퇴장',
    NOSHOW: '노쇼'
  }[reservationState] || reservationState;

  return reservationStateKor;
}

function changeTypeToKor(reservationType) {
  const reservationTypeKor = {
    WALK_IN: '현장 웨이팅',
    ONLINE: '온라인 예약'
  }[reservationType] || reservationType;

  return reservationTypeKor;
}
