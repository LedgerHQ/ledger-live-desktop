import React, { ReactNode, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, RemoteConfig } from "firebase/remote-config";
import { defaultFeatures } from "@ledgerhq/live-common/lib/featureFlags";
import { DefaultFeatures } from "@ledgerhq/live-common/lib/types";
import { reduce } from "lodash";

import { getFirebaseConfig } from "~/firebase-setup";

export const FirebaseRemoteConfigContext = React.createContext<RemoteConfig | null>(null);

export const useFirebaseRemoteConfig = () => useContext(FirebaseRemoteConfigContext);

export const formatFeatureId = (id: string) => `feature_${id}`;

// Firebase SDK treat JSON values as strings
const formatDefaultFeatures = (config: DefaultFeatures) =>
  reduce(
    config,
    (acc, feature, featureId) => ({
      ...acc,
      [formatFeatureId(featureId)]: JSON.stringify(feature),
    }),
    {},
  );

type Props = {
  children?: ReactNode;
};

export const FirebaseRemoteConfigProvider = ({ children }: Props): JSX.Element => {
  const [config, setConfig] = useState<RemoteConfig | null>(null);

  useEffect(() => {
    const firebaseConfig = getFirebaseConfig();

    initializeApp(firebaseConfig);

    const fetchConfig = async () => {
      const remoteConfig = getRemoteConfig();
      remoteConfig.defaultConfig = {
        ...formatDefaultFeatures(defaultFeatures),
      };
      await fetchAndActivate(remoteConfig);
      setConfig(remoteConfig);
    };
    fetchConfig();
  }, [setConfig]);

  return (
    <FirebaseRemoteConfigContext.Provider value={config}>
      {children}
    </FirebaseRemoteConfigContext.Provider>
  );
};
