// @flow

import { ipcRenderer } from "electron";
import React, { Component } from "react";

import type { IpcRendererEvent } from "electron";

export type UpdateStatus =
  | "idle"
  | "checking-for-update"
  | "update-available"
  | "update-not-available"
  | "download-progress"
  | "update-downloaded"
  | "checking"
  | "check-success"
  | "error";

export type UpdaterContextType = {
  status: UpdateStatus,
  downloadProgress: number,
  quitAndInstall: () => Promise<void>,
  setStatus: UpdateStatus => void,
  error: ?Error,
};

type MaybeUpdateContextType = ?UpdaterContextType;

type UpdaterProviderProps = {
  children: *,
};

type UpdaterProviderState = {
  status: UpdateStatus,
  downloadProgress: number,
  error: ?Error,
};

export const UpdaterContext = React.createContext<MaybeUpdateContextType>(null);

class Provider extends Component<UpdaterProviderProps, UpdaterProviderState> {
  constructor() {
    super();

    ipcRenderer.on("updater", this.listener);

    if (!__DEV__) {
      ipcRenderer.send("updater", "init");
    }

    this.state = {
      status: "idle",
      downloadProgress: 0,
      error: null,
    };
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("updater", this.listener);
  }

  listener = (
    e: IpcRendererEvent,
    args: { status: UpdateStatus, payload?: { percent?: number } },
  ) => {
    if (args.status === "download-progress") {
      const downloadProgress =
        args.payload && args.payload.percent ? +args.payload.percent.toFixed(0) : 0;
      this.setState({ status: args.status, downloadProgress });
    } else {
      this.setStatus(args.status);
    }
  };

  setStatus = (status: UpdateStatus) => {
    this.setState({ status });
  };

  setDownloadProgress = (downloadProgress: number) => this.setState({ downloadProgress });

  quitAndInstall = () => ipcRenderer.send("updater", "quit-and-install");

  render() {
    const { status, downloadProgress, error } = this.state;
    const value = {
      status,
      downloadProgress,
      error,
      setStatus: this.setStatus,
      quitAndInstall: this.quitAndInstall,
    };
    return <UpdaterContext.Provider value={value}>{this.props.children}</UpdaterContext.Provider>;
  }
}

export const withUpdaterContext = (ComponentToDecorate: React$ComponentType<*>) => (props: *) => (
  <UpdaterContext.Consumer>
    {context => <ComponentToDecorate {...props} context={context} />}
  </UpdaterContext.Consumer>
);

export const UpdaterProvider = Provider;
