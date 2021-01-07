// @flow

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

const remoteConfigUrl =
  "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/config/config.json";

export type RemoteConfig = {
  data: ?{
    "progressive-update": {
      [version: string]: {
        [platform: string]: number,
      },
    },
  },
  error: ?any,
  lastUpdatedAt: ?Date,
};

const defaultValue: RemoteConfig = {
  data: null,
  error: null,
  lastUpdatedAt: null,
};

export const RemoteConfigContext = React.createContext<RemoteConfig>(defaultValue);

export const useRemoteConfig = () => {
  return useContext(RemoteConfigContext);
};

type Props = {
  children: React$Node,
};

export const RemoteConfigProvider = ({ children }: Props) => {
  const [remoteConfig, setRemoteConfig] = useState<$Shape<RemoteConfig>>(defaultValue);

  useEffect(() => {
    axios
      .get(remoteConfigUrl)
      .then(result => {
        setRemoteConfig({
          data: result.data,
          error: null,
          lastUpdatedAt: new Date(),
        });
      })
      .catch((error: Error) => {
        setRemoteConfig({
          error,
          lastUpdatedAt: new Date(),
        });
      });
  }, []);

  return (
    <RemoteConfigContext.Provider value={remoteConfig}>{children}</RemoteConfigContext.Provider>
  );
};
