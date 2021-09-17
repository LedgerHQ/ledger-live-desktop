// @flow

import { useState } from "react";

export type RangeData = {
  count: number,
  increment: number,
};

const dataTable: Map<string, RangeData> = {
  year: {
    count: 50,
    increment: 7 * 24 * 60 * 60 * 1000,
  },
  month: {
    count: 30,
    increment: 24 * 60 * 60 * 1000,
  },
  week: {
    count: 7 * 24,
    increment: 60 * 60 * 1000,
  },
  day: {
    count: 24,
    increment: 60 * 60 * 1000,
  },
};

export const useRange = (range: string = "day") => {
  const [rangeData, setRangeData] = useState(dataTable[range]);

  return {
    rangeData,
    setRangeData,
  };
};
