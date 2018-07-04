// @flow
import { shell } from 'electron'
import { track } from 'analytics/segment'

export const openURL = (
  url: string,
  customEventName: string = 'OpenURL',
  extraParams: Object = {},
) => {
  track(customEventName, { ...extraParams, url })
  shell.openExternal(url)
}
