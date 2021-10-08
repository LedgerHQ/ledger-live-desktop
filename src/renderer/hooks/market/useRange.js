// @flow

import { useEffect, useState } from "react";

export type RangeData = {
  days: number,
  interval: string,
  simple: string,
};

const dataTable: Map<string, RangeData> = {
  "1y": {
    days: 365,
    interval: "daily",
    simple: "1y",
  },
  "30d": {
    days: 30,
    interval: "daily",
    simple: "30d",
  },
  "7d": {
    days: 7,
    interval: "hourly",
    simple: "7d",
  },
  "24h": {
    days: 1,
    interval: "hourly",
    simple: "24h",
  },
  "1h": {
    days: 0.04,
    interval: "minutely",
    simple: "1h",
  },
};

export const useRange = (range: string = "24h") => {
  useEffect(() => {
    setRangeData(dataTable[range]);
  }, [range]);

  const [rangeData, setRangeData] = useState(dataTable[range]);

  return {
    rangeData,
    setRangeData,
  };
};
