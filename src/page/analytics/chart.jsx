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
import { Doughnut, Line } from "react-chartjs-2";
import { chartUtils } from "../../utils/chartUtils";
import classes from "./chart.module.css";
import axi from "../../utils/axios/Axios";

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
    const [selectedChart, setSelectedChart] = useState("1");

    const getStatistics = async () => {
        try {
            const response = await axi.get("/api/popup/statistics/4");
            console.log(response.data);
            setTotalData(response.data);
        } catch (err) {
            console.error('실패:', err);
        }
    };


    useEffect(() => {
        getStatistics();
    }, []);

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

    const genderChartData = {
        labels: ["남성", "여성"],
        datasets: [
            {
                data: [genderRatio.maleRatio, genderRatio.femaleRatio],
                hoverOffset: 6,
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    const advanceNoShowChartData = {
        labels: ["노쇼", "취소", "정상 방문"],
        datasets: [
            {
                data: [advanceNoShowRatio.noShowRatio, advanceNoShowRatio.cancelRatio, advanceNoShowRatio.showRatio],
                backgroundColor: ["#FF6384", "#FFCE56", "#4BC0C0"],
            },
        ],
    };

    const walkInNoShowChartData = {
        labels: ["노쇼", "정상 방문"],
        datasets: [
            {
                data: [walkInNoShowRatio.noShowRatio, walkInNoShowRatio.showRatio],
                backgroundColor: ["#FF9F40", "#36A2EB"],
            },
        ],
    };

    const ageChartData = {
        labels: Object.keys(ageRatio),
        datasets: [
            {
                label: "연령대",
                data: Object.values(ageRatio),
                backgroundColor: chartUtils.barColors,
            },
        ],
    };
    
    return (
        <div className={classes.container}>
            <h2>📊 매장 대시보드</h2>
            <h3>{popupName}</h3>
            <div className={classes.tabGroup}>
                <label><input type="radio" value="1" checked={selectedChart === "1"} onChange={e => setSelectedChart(e.target.value)} /> 기본 정보</label>
                <label><input type="radio" value="2" checked={selectedChart === "2"} onChange={e => setSelectedChart(e.target.value)} /> 성별 비율</label>
                <label><input type="radio" value="3" checked={selectedChart === "3"} onChange={e => setSelectedChart(e.target.value)} /> 노쇼 비율</label>
                <label><input type="radio" value="4" checked={selectedChart === "4"} onChange={e => setSelectedChart(e.target.value)} /> 연령대</label>
                <label><input type="radio" value="5" checked={selectedChart === "5"} onChange={e => setSelectedChart(e.target.value)} /> 주간 방문자</label>
                <label><input type="radio" value="6" checked={selectedChart === "6"} onChange={e => setSelectedChart(e.target.value)} /> 시간별 방문자</label>
            </div>

            {selectedChart === "1" && (
                <div className={classes.summaryContainer}>
                    <div className={classes.summaryCard}><h4>총 예약 수</h4><p>{totalReservationCount}건</p></div>
                    <div className={classes.summaryCard}><h4>입장 수</h4><p>{totalEntranceCount}건</p></div>
                    <div className={classes.summaryCard}><h4>찜 수</h4><p>{likeCount}건</p></div>
                    <div className={classes.summaryCard}><h4>리뷰 수</h4><p>{reviewCount}건</p></div>
                    <div className={classes.summaryCard}><h4>평균 별점</h4><p>{averageRating}점</p></div>
                </div>
            )}

            {selectedChart === "2" && (
                <div className={classes.chartBox}>
                    <h4>성별 비율</h4>
                    <Doughnut data={genderChartData} options={chartUtils.donutChartOptions} />
                </div>
            )}

            {selectedChart === "3" && (
                <>
                    <div className={classes.chartBox}>
                        <h4>사전 예약 노쇼 비율</h4>
                        <Doughnut data={advanceNoShowChartData} options={chartUtils.donutChartOptions} />
                    </div>
                    <div className={classes.chartBox}>
                        <h4>현장 방문 노쇼 비율</h4>
                        <Doughnut data={walkInNoShowChartData} options={chartUtils.donutChartOptions} />
                    </div>
                </>
            )}

            {selectedChart === "4" && (
                <div className={classes.chartBox}>
                    <h4>연령대 비율</h4>
                    <Doughnut data={ageChartData} options={chartUtils.donutChartOptions} />
                </div>
            )}

            {selectedChart === "5" && (
                <div className={classes.chartContainer}>
                    {weeklyVisitors.map((week, idx) => {
                        const data = {
                            labels: week.dailyVisitors.map(d => d.date),
                            datasets: [{
                                label: `${week.weekNumber}주차`,
                                data: week.dailyVisitors.map(d => d.count),
                                borderColor: chartUtils.lineColors[idx % chartUtils.lineColors.length],
                                backgroundColor: chartUtils.lineColors[idx % chartUtils.lineColors.length],
                                tension: 0
                            }],
                        };
                        return (
                            <div key={idx} className={classes.chartBox}>
                                <Line data={data} options={chartUtils.lineChartOptions} />
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedChart === "6" && (
                <div className={classes.chartBox}>
                    <h4>시간대별 방문자 수</h4>
                    <Line
                        data={{
                            labels: hourlyVisitors.map(h => `${h.hour}시`),
                            datasets: [
                                {
                                    label: "방문자 수",
                                    data: hourlyVisitors.map(h => h.count),
                                    borderColor: "#4BC0C0",
                                    backgroundColor: "#4BC0C0",
                                    tension: 0,
                                },
                            ],
                        }}
                        options={chartUtils.lineChartOptions}
                    />
                </div>
            )}
        </div>
    );
    // return (
    //     <div className={classes.container}>
    //         <h2>📊 매장 대시보드</h2>
    //         <h3>매장명</h3>
    //         <div className={classes.tabGroup}>
    //             <label>
    //                 <input
    //                     type="radio"
    //                     value="1"
    //                     checked={selectedChart === "1"}
    //                     onChange={(e) => setSelectedChart(e.target.value)}
    //                 />
    //                 <span>기본 정보</span>
    //             </label>
    //             <label>
    //                 <input
    //                     type="radio"
    //                     value="2"
    //                     checked={selectedChart === "2"}
    //                     onChange={(e) => setSelectedChart(e.target.value)}
    //                 />
    //                 <span>성별 비율</span>
    //             </label>
    //             <label>
    //                 <input
    //                     type="radio"
    //                     value="3"
    //                     checked={selectedChart === "3"}
    //                     onChange={(e) => setSelectedChart(e.target.value)}
    //                 />
    //                 <span>노쇼 비율</span>
    //             </label>
    //             <label>
    //                 <input
    //                     type="radio"
    //                     value="4"
    //                     checked={selectedChart === "4"}
    //                     onChange={(e) => setSelectedChart(e.target.value)}
    //                 />
    //                 <span>일자별 방문자 수</span>
    //             </label>
    //         </div>
    //         {selectedChart === "1" && (
    //             <div className={classes.chartContainer}>
    //                 <div className={classes.summaryContainer}>
    //                     <div className={classes.summaryCard}>
    //                         <div className={classes.icon}>📅</div>
    //                         <div className={classes.textContainer}>
    //                             <h3>총 예약 수</h3>
    //                             <p>{totalReservationCount.toLocaleString()}건</p>
    //                         </div>
    //                     </div>
    //                     <div className={classes.summaryCard}>
    //                         <div className={classes.icon}>💖</div>
    //                         <div className={classes.textContainer}>
    //                             <h3>찜 수</h3>
    //                             <p>{wishCount.toLocaleString()}건</p>
    //                         </div>
    //                     </div>
    //                     <div className={classes.summaryCard}>
    //                         <div className={classes.icon}>📝</div>
    //                         <div className={classes.textContainer}>
    //                             <h3>리뷰 수</h3>
    //                             <p>{reviewCount.toLocaleString()}건</p>
    //                         </div>
    //                     </div>
    //                     <div className={classes.summaryCard}>
    //                         <div className={classes.icon}>⭐</div>
    //                         <div className={classes.textContainer}>
    //                             <h3>평균 별점</h3>
    //                             <p>{averageRating}점</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         )}

    //         {selectedChart === "2" && (
    //             <div className={classes.chartContainer}>
    //                 <div className={classes.card}>
    //                     <h4 className={classes.cardTitle}>성별 비율</h4>
    //                     <div className={classes.chartBox}>

    //                         <Doughnut data={genderChartData} options={chartUtils.donutChartOptions} />
    //                     </div>
    //                 </div>
    //             </div>
    //         )}

    //         {selectedChart === "3" && (
    //             <div className={classes.chartContainer}>
    //                 <div className={classes.card}>
    //                     <h4 className={classes.cardTitle}>노쇼 비율</h4>
    //                     <div className={classes.chartBox}>

    //                         <Doughnut data={noShowChartData} options={chartUtils.donutChartOptions} />
    //                     </div>
    //                 </div>
    //             </div>
    //         )}

    //         {selectedChart === "4" && (
    //             <div className={classes.chartContainer}>
    //                 {weeklyVisitors.map((weekData, index) => {
    //                     const chartData = {
    //                         labels: weekData.days.map((d) => d.date),
    //                         datasets: [
    //                             {
    //                                 label: `${weekData.week} 방문자 수`,
    //                                 data: weekData.days.map((d) => d.count),
    //                                 borderColor: chartUtils.lineColors[index % chartUtils.lineColors.length],
    //                                 backgroundColor: chartUtils.lineColors[index % chartUtils.lineColors.length],
    //                                 pointBackgroundColor: "#fff",
    //                                 pointBorderColor: chartUtils.lineColors[index % chartUtils.lineColors.length],
    //                                 borderWidth: 2,
    //                                 tension: 0.3,
    //                                 pointRadius: 4,
    //                                 pointHoverRadius: 6,
    //                                 fill: false,
    //                             },
    //                         ],
    //                     };

    //                     return (
    //                         <div key={weekData.week} className={classes.thinCard}>
    //                             <h4 className={classes.cardTitle}>{weekData.week} 방문자 수</h4>
    //                             <div className={classes.chartBox}>

    //                                 <Line data={chartData} options={chartUtils.lineChartOptions} />
    //                             </div>
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //         )}
    //     </div>
    // );
};

export default Chart;
