/* eslint-disable */

declare var process: {
  send(args: any): void,
  on(event: string, args: any): void,
  nextTick(callback: Function): void,
  setMaxListeners(any): void,
  title: string,
  env: Object,
}
