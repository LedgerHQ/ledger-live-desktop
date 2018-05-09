// @flow

export type Item = {
  date: Date,
  value: number,
}

type EnrichedItem = {
  date: string,
  value: number,
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
