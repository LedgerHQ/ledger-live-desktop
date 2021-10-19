// @flow

import { useEffect, useState } from "react";

export type RangeData = {
  days: number,
  interval: string,
  simple: string,
  scale: string,
};

const dataTable: { [key: string]: RangeData } = {
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

export const useRange = (range: string = "24h") => {
  useEffect(() => {
    setRangeData(dataTable[range]);
  }, [range]);

  const [rangeData, setRangeData] = useState<RangeData>(dataTable[range]);

  return {
    rangeData,
    setRangeData,
  };
};
