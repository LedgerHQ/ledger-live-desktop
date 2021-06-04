// @flow
/* eslint-disable react/jsx-no-literals */

import React, { Component } from "react";

import { withUpdaterContext } from "./UpdaterContext";
import type { UpdaterContextType } from "./UpdaterContext";

const statusToDebug = [
  "idle",
  "download-progress",
  "checking",
  "check-success",
  "error",
  "update-available",
];

type Props = {
  context: UpdaterContextType,
};

class DebugUpdater extends Component<Props> {
  render() {
    const { context } = this.props;
    const { status, setStatus, quitAndInstall } = context;
    return (
      <div style={styles.root}>
        <h1>
          DEBUG UPDATE
          <br />
          ------------
          <br />
        </h1>
        <b>status:</b> {status}
        <div style={{ marginTop: 20 }}>
          {statusToDebug.map(s => (
            <button key={s} style={styles.btn} onClick={() => setStatus(s)}>
              {status === s ? `[${s}]` : s}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <b>simulate update</b>
        </div>
        <div style={{ marginTop: 20 }}>
          <button style={styles.btn} onClick={quitAndInstall}>
            {"quit and install"}
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    padding: 10,
    fontSize: 10,
    background: "palette.text.shade100",
    color: "palette.background.paper",
    fontFamily: "monospace",
    zIndex: 1000,
    maxWidth: 250,
  },
  btn: {
    cursor: "pointer",
    background: "lightgreen",
    color: "palette.text.shade100",
    border: "none",
    marginRight: 10,
    marginTop: 10,
    padding: "0px 10px",
  },
};

export default withUpdaterContext(DebugUpdater);
