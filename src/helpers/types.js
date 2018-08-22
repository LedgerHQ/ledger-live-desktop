// @flow
export type LedgerScriptParams = {
  firmware?: string,
  firmware_key?: string,
  delete?: string,
  delete_key?: string,
  targetId?: string | number,
  name: string,
  version: string,
  icon: string,
  app?: number,
  hash?: string,
  perso?: string,
}
