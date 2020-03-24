import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

const remoteConfigUrl =
  "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/config/config.json";

export const RemoteConfigContext = React.createContext(null);

export const useRemoteConfig = () => {
  return useContext(RemoteConfigContext);
};

export const RemoteConfigProvider = ({ children }) => {
  const [remoteConfig, setRemoteConfig] = useState(null);

  useEffect(() => {
    axios.get(remoteConfigUrl).then(result => {
      setRemoteConfig(result.data);
    });
  }, []);

  return (
    <RemoteConfigContext.Provider value={remoteConfig}>{children}</RemoteConfigContext.Provider>
  );
};
