export const chartUtils = {
  // 차트에 표시할 카테고리 데이터를 가공하는 함수
  // 상위 5개만 표시, 나머지는 기타로 묶어서 처리
  // 최종적으로 카테고리명 배열과 금액 배열 반환
  processChartData(categories, maxLabels = 5) {
    const sortedCategories = [...categories].sort((a, b) => b.total - a.total);
    const topCategories = sortedCategories.slice(0, maxLabels);
    const others = sortedCategories.slice(maxLabels);

    const topLabels = topCategories.map(item => item.category);
    const topData = topCategories.map(item => item.total);

    if (others.length > 0) {
      topLabels.push("기타");
      topData.push(others.reduce((sum, item) => sum + item.total, 0));
    }

    return { labels: topLabels, data: topData };
  },
  
  lineColors: [
    "#FF6B57",  // 주황
    "#4BC0C0",  // 민트
    "#36A2EB",  // 파랑
    "#9966FF",  // 보라
    "#F4C430",  // 머스타드
    "#FF6384",  // 핑크
    "#00C49F",  // 청록
  ],
  donutChartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, boxHeight: 12 }
      }
    }
  },

  barChartOptions: {
    responsive: true,
    plugins: {
      legend: { labels: "", position: "bottom" }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => value >= 1000000 ? `${value / 1000000}백만` : value
        }
      }
    }
  },

  lineChartOptions: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10
        }
      }
    }
  }


}