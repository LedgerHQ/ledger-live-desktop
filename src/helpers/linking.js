// @flow
import { track } from 'analytics/segment'

let shell
if (!process.env.STORYBOOK_ENV) {
  const electron = require('electron')
  shell = electron.shell
}

export const openURL = (
  url: string,
  customEventName: string = 'OpenURL',
  extraParams: Object = {},
) => {
  track(customEventName, { ...extraParams, url })
  shell && shell.openExternal(url)
}
