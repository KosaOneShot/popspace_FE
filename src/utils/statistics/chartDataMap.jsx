// src/utils/chartDataMap.jsx
import { Doughnut, Line } from "react-chartjs-2";
import { chartUtils } from "../chartUtils";


const renderOrEmpty = (condition, component) => {
  return condition ? component : <p style={{ textAlign: "center", margin: "1rem" }}>데이터가 없습니다</p>;
};

const createDoughnutChart = (labels, data, backgroundColor) => (
  <Doughnut
    data={{
      labels,
      datasets: [{ data, backgroundColor, hoverOffset: 6 }]
    }}
    options={chartUtils.donutChartOptions}
  />
);

const createLineChart = (labels, data, color) => (
  <div style={{ width: "300px", height: "250px", margin: "0 auto" }}> 
    <Line
      data={{
        labels,
        datasets: [{
          label: "방문자 수",
          data,
          borderColor: color,
          backgroundColor: color,
          tension: 0,
        }]
      }}
      options={chartUtils.lineChartOptions}
    />
  </div>
);

const getFixed7DayLabels = (startDateStr) => {
  const result = [];
  const startDate = new Date(startDateStr);
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    result.push(d.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
  }
  return result;
};

const fillMissingDates = (labels, dataList) => {
  const map = new Map(dataList.map(d => [d.date, d.count]));
  return labels.map(label => map.get(label) ?? 0);
};

export const createChartDataMap = (genderRatio, advanceNoShowRatio, walkInNoShowRatio, ageRatio, hourlyVisitors, weeklyVisitors) => ({
  gender: {
    component: renderOrEmpty(
      genderRatio && (genderRatio.maleRatio > 0 || genderRatio.femaleRatio > 0),
      createDoughnutChart(
        ["남성", "여성"],
        [genderRatio.maleRatio, genderRatio.femaleRatio],
        ["#36A2EB", "#FF6384"]
      )
    )
  },
  advanceNoShow: {
    component: renderOrEmpty(
      advanceNoShowRatio && (advanceNoShowRatio.noShowRatio + advanceNoShowRatio.cancelRatio + advanceNoShowRatio.showRatio > 0),
      createDoughnutChart(
        ["노쇼", "취소", "정상 방문"],
        [advanceNoShowRatio.noShowRatio, advanceNoShowRatio.cancelRatio, advanceNoShowRatio.showRatio],
        ["#FF6384", "#FFCE56", "#4BC0C0"]
      )
    )
  },
  walkInNoShow: {
    component: renderOrEmpty(
      walkInNoShowRatio && (walkInNoShowRatio.noShowRatio + walkInNoShowRatio.showRatio > 0),
      createDoughnutChart(
        ["노쇼", "정상 방문"],
        [walkInNoShowRatio.noShowRatio, walkInNoShowRatio.showRatio],
        ["#FF9F40", "#36A2EB"]
      )
    )
  },
  age: {
    component: renderOrEmpty(
      ageRatio && Object.values(ageRatio).some(val => val > 0),
      createDoughnutChart(
        Object.keys(ageRatio),
        Object.values(ageRatio),
        chartUtils.barColors
      )
    )
  },
  hourly: {
    component: renderOrEmpty(
      hourlyVisitors && hourlyVisitors.length > 0,
      createLineChart(
        hourlyVisitors.map(h => `${h.hour}시`),
        hourlyVisitors.map(h => h.count),
        "#4BC0C0"
      )
    )
  },
  weekly: {
    component: renderOrEmpty(
      weeklyVisitors && weeklyVisitors.length > 0,
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
        {weeklyVisitors.map((week, idx) => {
          const color = chartUtils.lineColors[idx % chartUtils.lineColors.length];
          const labels = getFixed7DayLabels(week.dailyVisitors[0]?.date || new Date().toISOString().slice(0, 10));
          const counts = fillMissingDates(labels, week.dailyVisitors || []);
          return (
            <div key={idx} style={{ width: "300px" }}>
              {createLineChart(labels, counts, color)}
            </div>
          );
        })}
      </div>
    )
  }
});