import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axi from '../../utils/axios/Axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ role: null, nickname: null });

    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;
        //     if (location.pathname === '/api/auth/login') {
        //   setLoading(false);
        //   return;
        // }

        const reuslt = axi.post('/auth/check')
            .then((res) => {
                setAuth({
                    role: res.data.role,
                    nickname: res.data.nickname, // ✅ 닉네임도 함께 저장
                });
                console.log(res.data);
                
            })
            .catch(() => {
                setAuth({ role: null, userNickname: null });
            })
            .finally(() => setLoading(false));
;
            
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ ...auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
