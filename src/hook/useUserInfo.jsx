// src/hooks/useUserInfo.js
import { useEffect, useState } from 'react';
import axi from '../utils/axios/Axios';

const useUserInfo = () => {
    const [role, setRole] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axi.post('/api/auth/check');
                setRole(res.data.role);
                setNickname(res.data.nickname);
            } catch (err) {
                console.error('사용자 정보 가져오기 실패:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return { nickname, role, error, loading }; // ✅ 수정된 부분
};

export default useUserInfo;
