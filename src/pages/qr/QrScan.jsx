import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axi from '../../utils/axios/Axios';
import useUserInfo from '../../hook/useUserInfo';
import './QrScanPage.css';

const QrScan = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [scanning, setScanning] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const html5QrCodeRef = useRef(null);
    const qrReaderContainerRef = useRef(null);
    const hasStartedRef = useRef(false);
    //todo 받아오기
    const { nickname,role, error, loading } = useUserInfo();
    const [reservationInfo, setReservationInfo] = useState(null);

    // 스캔 성공시 서버 호출
    const handleScanSuccess = async (decodedText) => {
        try {
            const urlObj = new URL(decodedText);
            const reserveId = urlObj.searchParams.get('reserveId');
            const sig = urlObj.searchParams.get('sig');

            if (!reserveId || !sig) {
                setErrorMessage('QR 코드 형식이 올바르지 않습니다.');
                return;
            }

            const apiUrl = '/api/qr/verify';
            const res = await axi.post(apiUrl, { reserveId, sig });
            setReservationInfo(res.data);
            setErrorMessage('');
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('서버 응답 없음 또는 네트워크 오류');
            }
        }
    };

    const handleCheckIn = async () => {
        try {
            await axi.post('/api/admin/reservation/checkin', {
                reserveId: reservationInfo.reserveId
            });
            alert('입장 처리가 완료되었습니다.');
        } catch (error) {
            console.error('입장 처리 실패:', error);
            alert('입장 처리에 실패했습니다.');
        }
    };

    const handleCheckOut = async () => {
        try {
            await axi.post('/api/admin/reservation/checkout', {
                reserveId: reservationInfo.reserveId
            });
            alert('퇴장 처리가 완료되었습니다.');
        } catch (error) {
            console.error('퇴장 처리 실패:', error);
            alert('퇴장 처리에 실패했습니다.');
        }
    };

    // 전면 카메라 여부 (전면 카메라 좌우반전 위해)
    const isFrontCamera = (label) => {
        const keywords = ['front', 'user', 'face'];
        const lower = label?.toLowerCase() || '';
        return keywords.some(word => lower.includes(word));
    };

    // 카메라 초기화
    const startCamera = async () => {
        if (html5QrCodeRef.current) {
            console.warn('이미 카메라가 실행 중입니다.');
            return;
        }

        const { Html5Qrcode } = await import('html5-qrcode');
        const scanner = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
            setErrorMessage('카메라를 찾을 수 없습니다.');
            return;
        }

        // 후면 카메라 우선 선택
        const backCamera = cameras.find(device =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
        );
        const selectedDevice = backCamera || cameras[0];
        const selectedDeviceId = selectedDevice.id;

        // 전면 카메라면 좌우반전
        if (qrReaderContainerRef.current) {
            if (isFrontCamera(selectedDevice.label)) {
                qrReaderContainerRef.current.classList.add('mirror');
            } else {
                qrReaderContainerRef.current.classList.remove('mirror');
            }
        }

        setScanning(true);
        await scanner.start(
            selectedDeviceId,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1,
            },
            (decodedText) => {
                setScanning(false);
                scanner.stop().catch(() => { });
                handleScanSuccess(decodedText);
            },
            () => { }
        );
    };

    // DOM이 렌더링된 이후에만 카메라 시작
    useEffect(() => {

        const interval = setInterval(() => {
            if (
                qrReaderContainerRef.current &&
                !hasStartedRef.current &&
                !html5QrCodeRef.current
            ) {
                hasStartedRef.current = true;
                startCamera();
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // unmount 시 정리
    // clear 전 stop 보장: setTimeout 추가
    useEffect(() => {
        return () => {
            const scanner = html5QrCodeRef.current;
            if (!scanner) return;

            (async () => {
                try {
                    await scanner.stop();
                    await new Promise((r) => setTimeout(r, 200));
                    await scanner.clear();
                } catch (e) {
                    console.warn('Unmount 중 stop/clear 오류:', e?.message);
                } finally {
                    html5QrCodeRef.current = null;
                }
            })();
        };
    }, []);


    return (
        <div className="container text-center"
             style={{
                 maxWidth: 360,
                 marginTop: 70
             }}>
            <div>{role}: {nickname}</div>

            {/* QR 스캔 UI */}
            <h3 className="mb-3"
                style={{
                    color: '#1D9D8B',
                }}>
                QR {scanning ? '(스캔 중)' : '(스캔 완료)'}
            </h3>

            <div style={{ position: 'relative', width: 320, height: 320, margin: '0px auto' }}>
                <div
                    id="qr-reader"
                    ref={qrReaderContainerRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: reservationInfo || errorMessage ? 'none' : 'block'
                    }}
                />

                {(reservationInfo || errorMessage) && (
                    <div style={{
                        border: '1px solid #DB9506',
                        borderRadius: '16px',
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        width: '100%',
                        maxWidth: '320px',
                        textAlign: 'start',
                        marginBottom: '16px'
                    }}>
                        {errorMessage && (
                            <>
                                <p style={{ color: '#E74C3C', marginBottom: '16px' }}>{errorMessage}</p>
                            </>
                        )}

                        {reservationInfo && (
                            <>
                                <h5 style={{ color: '#1D9D8B', marginBottom: '16px' }}>예약 정보</h5>
                                <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '24px', color: '#888888' }}>
                                    {reservationInfo.popupName}
                                </p>
                                <hr style={{ border: 'none', borderBottom: '1px solid #000', marginBottom: '16px' }} />
                                <p style={{ color: '#888888', marginBottom: '8px' }}>
                                    예약자명&nbsp; <span style={{ color: '#000000' }}>{reservationInfo.memberName}</span>
                                </p>
                                <p style={{ color: '#888888', marginBottom: '8px' }}>
                                    예약날짜&nbsp; <span style={{ color: '#000000' }}>{reservationInfo.reserveDate}</span>
                                </p>
                                <p style={{ color: '#888888', marginBottom: '8px' }}>
                                    예약시간&nbsp; <span style={{ color: '#000000' }}>{reservationInfo.reserveTime}</span>
                                </p>
                                <p style={{ color: '#888888', marginBottom: '8px' }}>
                                    예약타입&nbsp; <span style={{ color: '#000000' }}>
                                        {reservationInfo.reservationType === 'ADVANCE' ? '사전 예약' : reservationInfo.reservationType === 'WALK_IN' ? '현장 웨이팅' : '알 수 없음'}
                                    </span>
                                </p>

                                <div className="mt-4">
                                    {reservationInfo.reservationState === 'EMAIL_SEND' && (
                                        <>
                                            <p style={{ color: '#1D9D8B' }}>입장 가능한 예약</p>
                                            <button
                                                className="btn btn-success w-100 mt-2"
                                                onClick={handleCheckIn}
                                            >
                                                입장 처리
                                            </button>
                                        </>
                                    )}
                                    {reservationInfo.reservationState === 'RESERVED' && (
                                            <p style={{ color: '#1D9D8B' }}>아직 입장 시간이 아닙니다.</p>
                                    )}
                                    {reservationInfo.reservationState === 'CANCELED' && (
                                        <p style={{ color: '#E74C3C' }}>취소된 예약입니다</p>
                                    )}
                                    {reservationInfo.reservationState === 'CHECKED_IN' && (
                                        <>
                                            <p style={{ color: '#1D9D8B' }}>입장 처리된 예약</p>
                                            <button
                                                className="btn btn-danger w-100 mt-2"
                                                onClick={handleCheckOut}
                                            >
                                                퇴장 처리
                                            </button>
                                        </>
                                    )}
                                    {reservationInfo.reservationState === 'CHECKED_OUT' && (
                                        <p style={{ color: '#E74C3C' }}>퇴장 처리된 예약입니다</p>
                                    )}
                                    {reservationInfo.reservationState === 'NOSHOW' && (
                                        <p style={{ color: '#E74C3C' }}>노쇼 처리된 예약입니다</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* 다시 스캔하기 */}
                        <div style={{ marginTop: '12px', width: '100%', maxWidth: '320px' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ width: '100%' }}
                                onClick={async () => {
                                    if (isProcessing) return;
                                    setIsProcessing(true);
                                    setReservationInfo(null);
                                    setErrorMessage('');

                                    const scanner = html5QrCodeRef.current;
                                    try {
                                        if (scanner) {
                                            (async () => {
                                                try {
                                                    await scanner.stop(); // 먼저 스캔 중단
                                                    await scanner.clear(); // 그 다음에 클리어 (그러나 보장은 x)
                                                } catch (err) {
                                                    console.warn('Unmount 중 stop/clear 오류:', err.message);
                                                } finally {
                                                    html5QrCodeRef.current = null;
                                                }
                                            })();
                                        }

                                    } catch (outerErr) {
                                        console.error('스캐너 상태 확인 오류:', outerErr.message);
                                    }

                                    try {
                                        await startCamera();
                                    } catch (startErr) {
                                        console.error('카메라 시작 오류:', startErr.message);
                                        setErrorMessage('카메라 시작 오류: ' + startErr.message);
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}
                            >다시 스캔하기</button>
                        </div>
                    </div>
                )}
            </div>

            {!reservationInfo && !errorMessage && (
                <p className="mt-3 text-muted">QR 코드를 정사각형 안에 맞춰 주세요</p>
            )}
        </div>
    );
};

export default QrScan;
