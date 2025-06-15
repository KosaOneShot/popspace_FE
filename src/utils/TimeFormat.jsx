
//'2025-06-30T17:00:00' -> '2025년 06월 30일'
export function formatDate(str) {
  if (!str) return '-';
  let datePart;
  if (str.includes('T')) { // ISO 8601 포맷
    [datePart] = str.split('T');
  } else if (str.includes(' ')) { // 공백으로 구분된 경우
    [datePart] = str.split(' ');
  } else if (str.includes('-')) { // YYYY-MM-DD 만 있는 경우
    datePart = str;
  } 
  else return '-'; // 날짜 정보가 없으면
  const [y, m, d] = datePart.split('-');
  return `${y}년 ${m}월 ${d}일`;
}

//'2025-06-30T17:00:00' -> '17시 00분'
export function formatTime(str) {
  if (!str) return '-'; 
  let timePart;
  if (str.includes('T')) {
    [, timePart] = str.split('T');
  } else if (str.includes(' ')) {
    [, timePart] = str.split(' ');
  } else {
    timePart = str;
  }
  // 2) 'HH:MM:SS' 또는 'HH:MM' 형태에서 시, 분 분해
  const [hh, mm] = timePart.split(':');
  return `${hh}시 ${mm}분`;
}

//'2025-06-30T17:00:00' -> '2025년 06월 30일 17시 00분'
export function formatDateTime(str) {
  if (!str) return '-';
  let datePart, timePart;
  if (str.includes('T')) {
    [datePart, timePart] = str.split('T');
  } else if (str.includes(' ')) {
    [datePart, timePart] = str.split(' ');
  } else {
    datePart = str;
    timePart = '';
  }
  const [y, m, d] = datePart.split('-'); // 2) 날짜 분해
  const [hh = '00', mm = '00'] = (timePart || '').split(':');
  return `${y}년 ${m}월 ${d}일 ${hh}시 ${mm}분`;
}