// @flow
import "./setup";
import { BrowserWindow, screen } from "electron";
import path from "path";

const intFromEnv = (key: string, def: number): number => {
  const v = process.env[key];
  if (!isNaN(v)) return parseInt(v, 10);
  return def;
};

export const DEFAULT_WINDOW_WIDTH = intFromEnv("LEDGER_DEFAULT_WINDOW_WIDTH", 1024);
export const DEFAULT_WINDOW_HEIGHT = intFromEnv("LEDGER_DEFAULT_WINDOW_HEIGHT", 768);
export const MIN_WIDTH = intFromEnv("LEDGER_MIN_WIDTH", 1024);
export const MIN_HEIGHT = intFromEnv("LEDGER_MIN_HEIGHT", 700);

const { DEV_TOOLS } = process.env;

let mainWindow = null;

export const getMainWindow = () => mainWindow;

const getWindowPosition = (width, height, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display;

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  };
};

const defaultWindowOptions = {
  // icons: 'path/to/icon'
  backgroundColor: "#fff",
  webPreferences: {
    blinkFeatures: "OverlayScrollbars",
    devTools: DEV_TOOLS,
    experimentalFeatures: true,
    nodeIntegration: true,
  },
};

export const loadWindow = async () => {
  if (mainWindow) {
    await mainWindow.loadURL(__DEV__ ? INDEX_URL : `file://${__dirname}/index.html`);
  }
};

export async function createMainWindow({ dimensions, positions }: any) {
  // TODO renderer should provide the saved window rectangle
  const width = dimensions ? dimensions.width : DEFAULT_WINDOW_WIDTH;
  const height = dimensions ? dimensions.height : DEFAULT_WINDOW_HEIGHT;
  const windowPosition = positions || getWindowPosition(width, height);

  const windowOptions = {
    ...defaultWindowOptions,
    x: windowPosition.x,
    y: windowPosition.y,
    /* eslint-disable indent */
    ...(process.platform === "darwin"
      ? {
          frame: false,
          titleBarStyle: "hiddenInset",
        }
      : {}),
    /* eslint-enable indent */
    width,
    height,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preloader.bundle.js"),
      ...defaultWindowOptions.webPreferences,
    },
  };

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.name = "MainWindow";

  loadWindow();

  if (DEV_TOOLS) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}
