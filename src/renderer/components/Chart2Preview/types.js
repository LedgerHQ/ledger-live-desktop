// @flow

import type { BigNumber } from "bignumber.js";

export type Item = {
  date: Date,
  value: BigNumber,
} & Object;

type EnrichedItem = {
  date: string,
  value: BigNumber,
  parsedDate: Date,
  ref: Item,
};

export type Data = Item[];
export type EnrichedData = EnrichedItem[];

export type CTX = {
  NODES: Object,
  MARGINS: Object,
  COLORS: Object,
  INVALIDATED: Object,
  HEIGHT: number,
  WIDTH: number,
  DATA: EnrichedData,
  x: Function,
  y: Function,
};
