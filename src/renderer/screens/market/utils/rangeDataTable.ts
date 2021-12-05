// @flow
export type RangeData = {
  days: number;
  interval: string;
  simple: string;
  scale: string;
  mockData: any[];
};

const timeStampSteps = {
  "1y": 365 * 24 * 60 * 60 * 1000,
  "30d": 365 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "1h": 60 * 60 * 1000,
};

const getMockDataForRange = range => {
  const data = [];
  for (let i = 1; i < 10; i++) {
    let value: number;
    if (i < 4) {
      value = i * 10;
    } else if (i < 7) {
      value = i * 7;
    } else {
      value = i * 4;
    }
    data.push({
      date: new Date(Date.now() - (timeStampSteps[range] / 10) * i),
      value,
    });
  }

  return data;
};

export const rangeDataTable: { [key: string]: RangeData } = {
  "1y": {
    days: 365,
    interval: "daily",
    simple: "1y",
    scale: "year",
    mockData: getMockDataForRange("1y"),
  },
  "30d": {
    days: 30,
    interval: "daily",
    simple: "30d",
    scale: "month",
    mockData: getMockDataForRange("30d"),
  },
  "7d": {
    days: 7,
    interval: "hourly",
    simple: "7d",
    scale: "week",
    mockData: getMockDataForRange("7d"),
  },
  "24h": {
    days: 1,
    interval: "hourly",
    simple: "24h",
    scale: "day",
    mockData: getMockDataForRange("24h"),
  },
  "1h": {
    days: 0.04,
    interval: "minutely",
    simple: "1h",
    scale: "minute",
    mockData: getMockDataForRange("1h"),
  },
};
