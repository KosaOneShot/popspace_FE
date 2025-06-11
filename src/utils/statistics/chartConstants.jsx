// src/constants/chartConstants.js
export const CHART_TABS = {
  BASE: "1",
  GENDER: "2",
  NOSHOW: "3",
  AGE: "4",
  WEEKLY: "5",
  HOURLY: "6",
};

export const tabLabels = [
  { label: "기본 정보", value: CHART_TABS.BASE },
  { label: "성별 비율", value: CHART_TABS.GENDER },
  { label: "노쇼 비율", value: CHART_TABS.NOSHOW },
  { label: "연령대", value: CHART_TABS.AGE },
  { label: "주간 방문자", value: CHART_TABS.WEEKLY },
  { label: "시간별 방문자", value: CHART_TABS.HOURLY },
];
