import { shell } from "electron";

export const handleMessageEvent = ({ event, handler }) => {
  if (event.channel === "webviewToParent") {
    handler(JSON.parse(event.args[0]));
  }
};

export const handleNewWindowEvent = async e => {
  const protocol = new URL(e.url).protocol;
  if (protocol === "http:" || protocol === "https:") {
    await shell.openExternal(e.url);
  }
};
