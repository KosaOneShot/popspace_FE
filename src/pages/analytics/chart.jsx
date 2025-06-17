import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import axi from "../../utils/axios/Axios";
import { CHART_TABS, tabLabels } from "../../utils/statistics/chartConstants";
import { createChartDataMap } from "../../utils/statistics/chartDataMap";
import classes from "./chart.module.css";
import { FaStar } from "react-icons/fa";
import StarRating from "../mypage/MyReviews/StarRating";

ChartJS.register(
    ArcElement,
    BarElement,
    Tooltip,
    Legend,
    Colors,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement
);

const Chart = () => {
    const [totalData, setTotalData] = useState(null);
    const [popupList, setPopList] = useState(null);
    const [popupNow, setPopupNow] = useState(null);
    const [selectedChart, setSelectedChart] = useState(CHART_TABS.BASE);

    const getPopupList = async () => {
        try {
            const response = await axi.get("/api/popup-admin/popup/list");
            setPopList(response.data);
            if (response.data.length > 0) {
                setPopupNow(response.data[0].popupId);
            }
        } catch (err) {
            console.error('팝업 리스트 가져오기 실패:', err);
        }
    };

    const getStatistics = async () => {
        try {
            const response = await axi.get(`/api/popup-admin/popup/statistics/${popupNow}`);
            console.log(response.data);
            setTotalData(response.data);
        } catch (err) {
            console.error('통계 데이터 가져오기 실패:', err);
        }
    };

    const handlePopupChange = (e) => {
        setPopupNow(Number(e.target.value));  // value는 string이므로 숫자로 변환
    };

    useEffect(() => {
        getPopupList();
    }, []);

    useEffect(() => {
        if (popupNow) {
            getStatistics(popupNow);
        }
    }, [popupNow]);

    if (!totalData) return <div>Loading...</div>;

    const {
        popupName,
        totalReservationCount,
        totalEntranceCount,
        likeCount,
        reviewCount,
        averageRating,
        genderRatio,
        ageRatio,
        advanceNoShowRatio,
        walkInNoShowRatio,
        weeklyVisitors,
        hourlyVisitors
    } = totalData;

    const chartDataMap = createChartDataMap(
        genderRatio,
        advanceNoShowRatio,
        walkInNoShowRatio,
        ageRatio,
        hourlyVisitors,
        weeklyVisitors
    );

    const summaryItems = [
        { title: "총 예약 수", value: totalReservationCount },
        { title: "입장 수", value: totalEntranceCount },
        { title: "찜 수", value: likeCount },
        { title: "리뷰 수", value: reviewCount },
        // { title: "평균 별점", value: averageRating },
    ];

    return (
        <div className={classes.container}>
            <div className={classes.headerWrapper}>
                <div className={classes.titleBox}>
                    <span className={classes.icon}>📊</span>
                    <h2 className={classes.title}>매장 대시보드</h2>
                </div>
                {popupList && (
                    <select value={popupNow} onChange={handlePopupChange} className={classes.popupSelector}>
                        {popupList.map(popup => (
                            <option key={popup.popupId} value={popup.popupId}>
                                {popup.popupName}
                            </option>
                        ))}
                    </select>
                )}
            </div>



            <div className={classes.tabGroup}>
                {tabLabels.map(({ label, value }) => (
                    <label key={value}>
                        <input
                            type="radio"
                            name="chartTab"
                            value={value}
                            checked={selectedChart === value}
                            onChange={(e) => setSelectedChart(e.target.value)}
                        />
                        <span>{label}</span>
                    </label>
                ))}
            </div>


            {selectedChart === CHART_TABS.BASE && (
                <>
                    <div className={classes.summaryGrid}>
                        {summaryItems.map(({ title, value }, idx) => (
                            <div key={idx} className={classes.summaryCard}>
                                <h4>{title}</h4>
                                <span>{value.toLocaleString()}건</span>
                            </div>
                        ))}
                    </div>
                    <div className={classes.centerCard}>
                        <h4>평균 별점</h4>
                        <span className={classes.rating}>
                            <StarRating rating={averageRating} readOnly />
                            <span>{averageRating?.toFixed(1)}점</span>
                        </span>
                    </div>
                </>
            )}

            {selectedChart === CHART_TABS.GENDER && (
                <div className={classes.chartBox}>
                    <h4>성별 비율</h4>
                    {chartDataMap.gender.component}
                </div>
            )}

            {selectedChart === CHART_TABS.NOSHOW && (
                <>
                    <div className={classes.chartBox}>
                        <h4>사전 예약 노쇼 비율</h4>
                        {chartDataMap.advanceNoShow.component}
                    </div>
                    <div className={classes.chartBox}>
                        <h4>현장 예약 노쇼 비율</h4>
                        {chartDataMap.walkInNoShow.component}
                    </div>
                </>
            )}

            {selectedChart === CHART_TABS.AGE && (
                <div className={classes.chartBox}>
                    <h4>연령대 비율</h4>
                    {chartDataMap.age.component}
                </div>
            )}

            {selectedChart === CHART_TABS.WEEKLY && (
                <div className={classes.chartBox}>
                    <h4>주간 방문자 수</h4>
                    {chartDataMap.weekly.component}
                </div>
            )}

            {selectedChart === CHART_TABS.HOURLY && (
                <div className={classes.chartBox}>
                    <h4>시간대별 방문자 수</h4>
                    {chartDataMap.hourly.component}
                </div>
            )}

        </div>
    );
};

export default Chart;
