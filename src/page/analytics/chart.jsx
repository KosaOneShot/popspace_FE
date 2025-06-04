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

    useEffect(() => {
        const result = {
            totalReservationCount: 1240,
            wishCount: 328,
            reviewCount: 87,
            averageRating: 4.6,
            genderRatio: {
                male: 60.0,
                female: 40.0,
            },
            ageRatio: {
                "10s": 5.0,
                "20s": 35.0,
                "30s": 40.0,
                "40s": 15.0,
                "50s": 3.0,
                "60s": 2.0,
            },
            noShowRatio: {
                noShow: 12.3,
                show: 87.7,
            },
            weeklyVisitors: [
                {
                    week: "1주차",
                    days: [
                        { date: "2025-06-01", count: 35 },
                        { date: "2025-06-02", count: 42 },
                        { date: "2025-06-03", count: 38 },
                        { date: "2025-06-04", count: 31 },
                        { date: "2025-06-05", count: 46 },
                        { date: "2025-06-06", count: 27 },
                        { date: "2025-06-07", count: 52 },
                    ],
                },
                {
                    week: "2주차",
                    days: [
                        { date: "2025-06-08", count: 35 },
                        { date: "2025-06-09", count: 42 },
                        { date: "2025-06-10", count: 38 },
                        { date: "2025-06-11", count: 31 },
                        { date: "2025-06-12", count: 46 },
                        { date: "2025-06-13", count: 27 },
                        { date: "2025-06-14", count: 52 },
                    ],
                },
                {
                    week: "3주차",
                    days: [
                        { date: "2025-06-15", count: 35 },
                        { date: "2025-06-16", count: 42 },
                        { date: "2025-06-17", count: 38 },
                        { date: "2025-06-18", count: 31 },
                        { date: "2025-06-19", count: 46 },
                        { date: "2025-06-20", count: 27 },
                        { date: "2025-06-21", count: 52 },
                    ]
                },
                {
                    week: "4주차",
                    days: [
                        { date: "2025-06-22", count: 35 },
                        { date: "2025-06-23", count: 42 },
                        { date: "2025-06-24", count: 38 },
                        { date: "2025-06-25", count: 31 },
                        { date: "2025-06-26", count: 46 },
                        { date: "2025-06-27", count: 27 },
                        { date: "2025-06-28", count: 52 },
                    ]
                },
            ],
        };

        setTotalData(result);
    }, []);

    if (!totalData) return <div>Loading...</div>;

    const {
        totalReservationCount,
        wishCount,
        reviewCount,
        averageRating,
        genderRatio,
        noShowRatio,
        weeklyVisitors,
    } = totalData;

    const genderChartData = {
        labels: ["남성", "여성"],
        datasets: [
            {
                data: [genderRatio.male, genderRatio.female],
                hoverOffset: 6,
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    const noShowChartData = {
        labels: ["노쇼", "정상 방문"],
        datasets: [
            {
                data: [noShowRatio.noShow, noShowRatio.show],
                hoverOffset: 6,
                backgroundColor: ["#FF9F40", "#4BC0C0"],
            },
        ],
    };

    return (
        <div className={classes.container}>
            <h2>📊 매장 대시보드</h2>
            <h3>매장명</h3>
            <div className={classes.tabGroup}>
                <label>
                    <input
                        type="radio"
                        value="1"
                        checked={selectedChart === "1"}
                        onChange={(e) => setSelectedChart(e.target.value)}
                    />
                    <span>기본 정보</span>
                </label>
                <label>
                    <input
                        type="radio"
                        value="2"
                        checked={selectedChart === "2"}
                        onChange={(e) => setSelectedChart(e.target.value)}
                    />
                    <span>성별 비율</span>
                </label>
                <label>
                    <input
                        type="radio"
                        value="3"
                        checked={selectedChart === "3"}
                        onChange={(e) => setSelectedChart(e.target.value)}
                    />
                    <span>노쇼 비율</span>
                </label>
                <label>
                    <input
                        type="radio"
                        value="4"
                        checked={selectedChart === "4"}
                        onChange={(e) => setSelectedChart(e.target.value)}
                    />
                    <span>일자별 방문자 수</span>
                </label>
            </div>
            {selectedChart === "1" && (
                <div className={classes.chartContainer}>
                    <div className={classes.summaryContainer}>
                        <div className={classes.summaryCard}>
                            <div className={classes.icon}>📅</div>
                            <div className={classes.textContainer}>
                                <h3>총 예약 수</h3>
                                <p>{totalReservationCount.toLocaleString()}건</p>
                            </div>
                        </div>
                        <div className={classes.summaryCard}>
                            <div className={classes.icon}>💖</div>
                            <div className={classes.textContainer}>
                                <h3>찜 수</h3>
                                <p>{wishCount.toLocaleString()}건</p>
                            </div>
                        </div>
                        <div className={classes.summaryCard}>
                            <div className={classes.icon}>📝</div>
                            <div className={classes.textContainer}>
                                <h3>리뷰 수</h3>
                                <p>{reviewCount.toLocaleString()}건</p>
                            </div>
                        </div>
                        <div className={classes.summaryCard}>
                            <div className={classes.icon}>⭐</div>
                            <div className={classes.textContainer}>
                                <h3>평균 별점</h3>
                                <p>{averageRating}점</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedChart === "2" && (
                <div className={classes.chartContainer}>
                    <div className={classes.card}>
                        <h4 className={classes.cardTitle}>성별 비율</h4>
                        <div className={classes.chartBox}>

                            <Doughnut data={genderChartData} options={chartUtils.donutChartOptions} />
                        </div>
                    </div>
                </div>
            )}

            {selectedChart === "3" && (
                <div className={classes.chartContainer}>
                    <div className={classes.card}>
                        <h4 className={classes.cardTitle}>노쇼 비율</h4>
                        <div className={classes.chartBox}>

                            <Doughnut data={noShowChartData} options={chartUtils.donutChartOptions} />
                        </div>
                    </div>
                </div>
            )}

            {selectedChart === "4" && (
                <div className={classes.chartContainer}>
                    {weeklyVisitors.map((weekData, index) => {
                        const chartData = {
                            labels: weekData.days.map((d) => d.date),
                            datasets: [
                                {
                                    label: `${weekData.week} 방문자 수`,
                                    data: weekData.days.map((d) => d.count),
                                    borderColor: chartUtils.lineColors[index % chartUtils.lineColors.length],
                                    backgroundColor: chartUtils.lineColors[index % chartUtils.lineColors.length],
                                    pointBackgroundColor: "#fff",
                                    pointBorderColor: chartUtils.lineColors[index % chartUtils.lineColors.length],
                                    borderWidth: 2,
                                    tension: 0.3,
                                    pointRadius: 4,
                                    pointHoverRadius: 6,
                                    fill: false,
                                },
                            ],
                        };

                        return (
                            <div key={weekData.week} className={classes.thinCard}>
                                <h4 className={classes.cardTitle}>{weekData.week} 방문자 수</h4>
                                <div className={classes.chartBox}>

                                    <Line data={chartData} options={chartUtils.lineChartOptions} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Chart;
