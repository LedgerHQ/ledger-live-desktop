// @flow

// import { track } from '~/analytics/segment'
import electron from "electron";

let shell;
if (!process.env.STORYBOOK_ENV) {
  shell = electron.shell;
}

export const openURL = (
  url: string,
  customEventName: string = "OpenURL",
  extraParams: Object = {},
) => {
  // track(customEventName, { ...extraParams, url })
  shell && shell.openExternal(url);
};
