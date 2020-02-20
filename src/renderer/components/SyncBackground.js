// @flow

import React, { PureComponent } from "react";
import { BridgeSyncConsumer } from "~/renderer/bridge/BridgeSyncContext";
import type { Sync } from "~/renderer/bridge/BridgeSyncContext";
import { getEnv } from "@ledgerhq/live-common/lib/env";

export class Effect extends PureComponent<{
  sync: Sync,
}> {
  componentDidMount() {
    const syncLoop = async () => {
      const { sync } = this.props;
      sync({ type: "BACKGROUND_TICK" });
      this.syncTimeout = setTimeout(syncLoop, getEnv("SYNC_ALL_INTERVAL"));
    };
    this.syncTimeout = setTimeout(syncLoop, getEnv("SYNC_BOOT_DELAY"));
  }

  componentWillUnmount() {
    clearTimeout(this.syncTimeout);
  }

  syncTimeout: *;

  render() {
    return null;
  }
}

const SyncBackground = () => (
  <BridgeSyncConsumer>{sync => <Effect sync={sync} />}</BridgeSyncConsumer>
);

export default SyncBackground;
