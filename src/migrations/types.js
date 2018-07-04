// @flow

export type Migration = {
  doc: string,
  run: () => Promise<void>,
}
