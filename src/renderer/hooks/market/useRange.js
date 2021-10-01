// @flow

import { useEffect, useState } from "react";

export type RangeData = {
  days: number,
  interval: string,
  simple: string,
};

const dataTable: Map<string, RangeData> = {
  year: {
    days: 365,
    interval: "daily",
    simple: "1y",
  },
  month: {
    days: 30,
    interval: "daily",
    simple: "30d",
  },
  week: {
    days: 7,
    interval: "hourly",
    simple: "7d",
  },
  day: {
    days: 1,
    interval: "hourly",
    simple: "24h",
  },
  hour: {
    days: 0.04,
    interval: "minutely",
    simple: "1h",
  },
};

export const useRange = (range: string = "day") => {
  useEffect(() => {
    setRangeData(dataTable[range]);
  }, [range]);

  const [rangeData, setRangeData] = useState(dataTable[range]);

  return {
    rangeData,
    setRangeData,
  };
};
