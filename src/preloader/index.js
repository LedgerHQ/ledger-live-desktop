// @flow

/*
  This file is bundled in to the preload bundle. It get loaded and executed before the renderer bundle.
  Everything set in the window scope will be available for the code that live in the renderer bundle.
  Node API can be reached by the renderer bundle through a proxy define here, even if its nodeIntegration flag is off.

  /!\ Everything done in this file must be safe, it can not afford to crash. /!\
*/

import { ipcRenderer, remote } from "electron";
import logo from "./logo.svg";
import palettes from "~/renderer/styles/palettes";

const appLoaded = () => {
  setTimeout(() => {
    const rendererNode = document.getElementById("react-root");
    const loaderContainer = document.getElementById("loader-container");
    const loader = document.getElementById("loader");

    if (rendererNode && loaderContainer && loader) {
      rendererNode.style.visibility = "visible";
      requestAnimationFrame(() => {
        loader.classList.add("loaded");
        loaderContainer.classList.remove("loading");
      });
    }
  }, 2000);
};

const reloadRenderer = () => ipcRenderer.invoke("reloadRenderer");

window.api = {
  appLoaded,
  reloadRenderer,
};

const init = async () => {
  const settings =
    (await ipcRenderer.invoke("getKey", {
      ns: "app",
      keyPath: "settings",
    })) || {};

  const osTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const palette = palettes[settings.theme || osTheme];
  remote.getCurrentWindow().setBackgroundColor(palette.background.default);

  window.onload = () => {
    const imgNode = ((document.getElementById("logo"): any): HTMLImageElement);
    const loaderContainer = document.getElementById("loader-container");

    if (imgNode && loaderContainer) {
      imgNode.src = logo;
      loaderContainer.style.backgroundColor = palette.background.default;
      loaderContainer.classList.add("loading");
    }

    setTimeout(() => {
      ipcRenderer.send("ready-to-show", {});
    }, 200);
  };
};

init();
