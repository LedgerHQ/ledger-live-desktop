// @flow

import type { BigNumber } from 'bignumber.js'

export type Item = {
  date: Date,
  value: BigNumber,
  originalValue: BigNumber,
}

type EnrichedItem = {
  date: string,
  value: BigNumber,
  parsedDate: Date,
  ref: Item,
}

export type Data = Array<Item>
export type EnrichedData = Array<EnrichedItem>

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
}
