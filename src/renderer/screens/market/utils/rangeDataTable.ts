// @flow
export type RangeData = {
  days: number;
  interval: string;
  simple: string;
  scale: string;
};

export const rangeDataTable: { [key: string]: RangeData } = {
  "1y": {
    days: 365,
    interval: "daily",
    simple: "1y",
    scale: "year",
  },
  "30d": {
    days: 30,
    interval: "daily",
    simple: "30d",
    scale: "month",
  },
  "7d": {
    days: 7,
    interval: "hourly",
    simple: "7d",
    scale: "week",
  },
  "24h": {
    days: 1,
    interval: "hourly",
    simple: "24h",
    scale: "day",
  },
  "1h": {
    days: 0.04,
    interval: "minutely",
    simple: "1h",
    scale: "minute",
  },
};
