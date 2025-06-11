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
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import axi from "../../../utils/axios/Axios";
import { createChartDataMap } from "../../../utils/statistics/chartDataMap";
import { CHART_TABS, tabLabels } from "../../../utils/statistics/chartConstants";
import { useParams } from "react-router-dom";
import classes from "./AdminPopupStatistics.module.css";
const AdminPopupStatistics = () => {
  const { popupId } = useParams(); // ← URL에서 popupId 추출
  const [totalData, setTotalData] = useState(null);
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState(CHART_TABS.BASE);

  const getStatistics = async () => {
    try {
      const response = await axi.get(`/api/admin/popup/statistics/${popupId}`);
      console.log(response.data);
      setTotalData(response.data);
    } catch (err) {
      console.error('통계 데이터 가져오기 실패:', err);
    }
  };

  useEffect(() => {
    getStatistics(popupId);
  }, [popupId]);

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
        <button
          onClick={() => navigate(-1)}
          className={classes.backButton}
        >
          ← 뒤로가기
        </button>
        <div className={classes.titleBox}>
          <span className={classes.icon}>📊</span>
          <h2 className={classes.title}>매장 대시보드</h2>
        </div>
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
            <span>
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(averageRating) ? "#FFD700" : "#e0e0e0"}
                />
              ))}
              &nbsp;{averageRating?.toFixed(1)}점
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
}

export default AdminPopupStatistics