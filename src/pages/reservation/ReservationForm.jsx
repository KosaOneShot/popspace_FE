import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axi from '../../utils/axios/Axios';
import { useNavigate } from 'react-router-dom';
// 커스텀 css
import './ReservationCalendar.css';

const ReservationForm = () => {
    const navigate = useNavigate();
    
    const [availableDates, setAvailableDates] = useState([]);
    const [fullyBookedDates, setFullyBookedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [lastReserveId, setLastReserveId] = useState(null);

    const { popupId } = useParams();

    // 예약하기 버튼 시 동작
    const handleReserveClick = async () => {
        if (!selectedDate || !selectedTime) return;

        const pad = (n) => n.toString().padStart(2, '0');
        const reserveDate = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;


        const payload = {
            popupId: Number(popupId),
            reserveDate,
            reserveTime: selectedTime,
        };

        try {
            const res = await axi.post('/api/reservation/advance', payload);
            console.log('예약 성공:', res.data);
            const reserveId = res.data.reserveId;
            setLastReserveId(reserveId);
            setConfirmMessage('예약 성공!');
            setShowConfirm(true);
            // remove navigate from here
        } catch (err) {
            const message = err?.response?.data?.message || '예약 중 오류가 발생했습니다.';
            setConfirmMessage(message);
            setShowConfirm(true);
        }
    };


    {/* 예약 가능 날짜 조회 */}
    useEffect(() => {
        axi.get(`/api/popups/${popupId}/available-dates`)
            .then(res => {
                const enabledDates = res.data.availableDates.map(dateStr => new Date(dateStr));
                const fullDates = res.data.fullyBookedDates.map(dateStr => new Date(dateStr));
                setAvailableDates(enabledDates);
                setFullyBookedDates(fullDates);
            })
            .catch(err => {
                console.error('예약 가능 날짜 조회 실패:', err);
            });
    }, [popupId]);


    {/* 선택한 날짜의 예약 가능 시간대 조회 */}
    useEffect(() => {
        if (!selectedDate) return;

        // 날짜 바뀔 때마다 시간 선택 초기화
        setSelectedTime(null);

        // yyyy-mm-dd
        const pad = (n) => n.toString().padStart(2, '0');
        const dateStr = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;

        axi.get(`/api/popups/${popupId}/available-times`, { params: { date: dateStr } })

            .then(res => {
                // ["10:00", "11:00", ...]
                const times = res.data?.times || [];
                setAvailableTimes(times);
            })
            .catch(err => {
                console.error('예약 가능 시간 조회 실패:', err);
                setAvailableTimes([]);
            });
    }, [selectedDate]);


    {/* 예약 불가 날짜 비활성화 */}
    const isDisabled = (date) => {
        const today = new Date();
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const availableDateOnly = availableDates.map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()));
        const fullyBookedDateOnly = fullyBookedDates.map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()));

        const isPast = dateOnly < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isUnavailable = !availableDateOnly.some(d => d.getTime() === dateOnly.getTime());
        const isFullyBooked = fullyBookedDateOnly.some(d => d.getTime() === dateOnly.getTime());

        return isPast || isUnavailable || isFullyBooked;
    };

    {/* 캡션, 요일 한국어 설정 */}
    const formatCaption = (month) =>
        `${month.getFullYear()}년 ${month.getMonth() + 1}월`;
    const formatWeekdayName = (day) =>
        ['일', '월', '화', '수', '목', '금', '토'][day.getDay()];

    return (
        <>
        <div className="container mt-6"
             style={{
                 height: '100%',
                 minHeight: '600px',
                 minHeight: '100%',
                 overflowY: 'auto',
                 marginTop: '70px', // 헤더 공간 확보
                 paddingBottom: '80px' // 예약하기 버튼 공간 확보
             }}
        >
            <div className="d-flex align-items-center mb-3">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => navigate(-1)}
              >
                ←
              </button>
              <p className="flex-grow-1 text-start m-0"
                 style={{ paddingLeft: '50px' }}>

                날짜와 시간을 선택해주세요
              </p>
            </div>
            {/* 달력 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{ disabled: isDisabled }}
                    modifiersClassNames={{
                        selected: 'custom-selected',
                        disabled: 'custom-disabled',
                        sunday: 'custom-sunday'
                    }}
                    classNames={{
                        day: 'custom-day',
                    }}
                    locale="ko"
                    formatters={{
                        formatCaption,
                        formatWeekdayName
                    }}
                />
            </div>

            {/* 날짜 선택 후 시간대/예약하기 버튼 출력 */}
            {selectedDate && (
                <>
                {/* 시간대 버튼 */}
                <hr style={{ border: 'none', borderBottom: '1px solid #ccc', marginBottom: '16px' }} />
                <div className="time-button-grid mt-">
                    {availableTimes.map((time) => (
                        <button
                            key={time.time}
                            className={`time-btn ${
                                !time.available ? 'disabled' : selectedTime === time.time ? 'selected' : ''
                            }`}
                            disabled={!time.available}
                            onClick={() => setSelectedTime(prev => prev === time.time ? null : time.time)}
                        >{time.time}
                        </button>
                    ))}
                </div>

                {/* 예약하기 버튼 */}
                <div className="reserve-btn-container">
                    <button
                        className={`reserve-btn ${selectedTime ? 'active' : 'inactive'}`}
                        disabled={!selectedTime}
                        onClick={handleReserveClick}
                        >예약하기
                    </button>
                </div>
                </>
            )}
        </div>
        {showConfirm && createPortal(
            <div
              style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 2000,
              }}
              onClick={() => setShowConfirm(false)}
            >
              <div
                style={{
                  position: 'fixed',
                  top: '45%', left: '50%',
                  width: '250px',
                  transform: 'translate(-50%, -50%)',
                  background: '#fff',
                  padding: '24px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  zIndex: 2001,
                }}
                onClick={e => e.stopPropagation()}
              >
                <p style={{ marginBottom: '16px' }}>{confirmMessage}</p>
                <button
                  className="btn"
                  style={{ backgroundColor: '#8250DF', color: '#fff' }}
                  onClick={() => {
                    setShowConfirm(false);
                    if (lastReserveId) {
                      navigate(`/reservation/detail/${lastReserveId}`);
                    }
                  }}
                >
                  확인
                </button>
              </div>
            </div>,
            document.body
        )}
        </>
    );
};

export default ReservationForm;
