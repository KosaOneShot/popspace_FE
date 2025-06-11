import React, { useEffect, useState } from 'react';
import axi from '../../utils/axios/Axios';
import classes from "./AdminPage.module.css";
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminPage = () => {
    const [popupList, setPopupList] = useState([]);
    const navigate = useNavigate(); // ← 추가

    const getPopupList = async () => {
        try {
            const response = await axi.get("/api/admin/popup/list");
            setPopupList(response.data);
        } catch (err) {
            console.error('팝업 리스트 가져오기 실패', err);
        }
    };

    useEffect(() => {
        getPopupList();
    }, []);

    const handleCardClick = (popupId, popupName) => {
        navigate(`/admin/popup/statistics/${popupId}`, {
            state: { popupName }
        });
    };
    return (
        <div className={classes.container}>
            <div className={classes.headerWrapper}>
                <div className={classes.titleBox}>
                    <i className={`bi bi-window ${classes.icon}`} />
                    <h2 className={classes.title}>팝업 목록</h2>
                </div>
            </div>

            <div className={classes.summaryGrid}>
                {popupList.map(({ popupId, popupName, memberName }) => (
                    <div
                        key={popupId}
                        className={classes.summaryCard}
                        onClick={() => handleCardClick(popupId, popupName)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h4>{popupName}</h4>
                        <p>생성자: {memberName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
