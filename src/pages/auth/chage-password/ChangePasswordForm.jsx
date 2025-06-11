import React from 'react'
import { useState } from 'react';
import styles from './ChangePasswordForm.module.css';
import axi from '../../../utils/axios/Axios';
import { Link } from 'react-router-dom';

const ChangePasswordForm = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRequestCode = async () => {
        try {
            await axi.post('/auth/reset-password/verify-email', { email });
            setStep(2);
            setMessage('입력하신 이메일로 인증 코드를 전송했습니다.');
        } catch (err) {
            setMessage(err.response?.data?.message || '이메일 전송 실패');
        }
    };

    const handleResetPassword = async () => {
        try {
            await axi.post('/auth/reset-password/verify-code', {
                email,
                code
            });
            setMessage('임시 비밀번호가 성공적으로 전송되었습니다..');
        } catch (err) {
            setMessage(err.response?.data?.message || '인증 실패 또는 변경 실패');
        }
    };

    return (
        <div className={styles.ChangePasswordFormContainer}>
            <div className={styles.changeContainer}>
                <h1 className={styles.title}>비밀번호 재발급</h1>
                <p className={styles.subtitle}>가입 시 사용한 이메일 주소로 인증 후 임시 비밀번호를 받습니다.</p>

                {step === 1 && (
                    <>
                        <p className={styles.stepText}>1단계: 이메일 인증</p>
                        <label className={styles.label}>이메일 주소</label>
                        <input
                            type="email"
                            placeholder="ex) example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <button onClick={handleRequestCode} className={styles.button}>
                            인증 코드 보내기
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className={styles.divider}></div>
                        <p className={styles.stepText}>2단계: 인증 코드 입력</p>
                        <label className={styles.label}>이메일로 받은 인증 코드</label>
                        <input
                            type="text"
                            placeholder="6자리 인증 코드"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <button onClick={handleResetPassword} className={styles.button}>
                            비밀번호 재발급
                        </button>
                    </>
                )}

                {message && (
                    <p className={message.includes('성공') || message.includes('전송') ? styles.success : styles.error}>
                        {message}
                    </p>
                )}

                <div className={styles.backToLogin}>
                    <Link to="/auth/login" className={styles.backLink}>← 로그인으로 돌아가기</Link>
                </div>
            </div>
        </div>
    );

}

export default ChangePasswordForm