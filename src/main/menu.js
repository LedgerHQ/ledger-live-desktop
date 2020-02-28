import { app, Menu } from "electron";
import { getMainWindow } from "./window-lifecycle";

const { DEV_TOOLS, DEV_TOOLS_MODE } = process.env;

const template = [
  {
    label: app.name,
    submenu: [
      { role: "hide" },
      { role: "hideothers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
    ],
  },
  {
    role: "window",
    submenu: [
      ...(__DEV__ || DEV_TOOLS
        ? [
            {
              label: "Main Window Dev Tools",
              click() {
                const mainWindow = getMainWindow();
                mainWindow.webContents.openDevTools({
                  mode: DEV_TOOLS_MODE,
                });
              },
            },
            { type: "separator" },
          ]
        : []),
      { role: "close" },
      { role: "minimize" },
      { role: "zoom" },
      { type: "separator" },
      { role: "front" },
    ],
  },
];

/*
 https://www.electronjs.org/docs/api/menu#menusetapplicationmenumenu
 To get rid of the menubar on windows/linux we need `null` ↓
*/
export default process.platform === "darwin" ? Menu.buildFromTemplate(template) : null;
