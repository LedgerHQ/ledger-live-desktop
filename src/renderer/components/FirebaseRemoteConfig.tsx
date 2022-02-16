import fs from "fs";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, RemoteConfig } from "firebase/remote-config";
import { defaultFeatures } from "@ledgerhq/live-common/lib/featureFlags";
import { DefaultFeatures } from "@ledgerhq/live-common/lib/types";
import { reduce } from "lodash";

import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import { firebaseConfig } from "~/firebase-setup";

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

function getDefaultConfig(features = {}): { [key: string]: any } {
  return {
    ...formatDefaultFeatures({
      ...defaultFeatures,
      ...features,
    }),
  };
}

async function initializeFirebase(): Promise<RemoteConfig> {
  initializeApp(firebaseConfig);

  const remoteConfig = getRemoteConfig();
  remoteConfig.defaultConfig = getDefaultConfig();
  await fetchAndActivate(remoteConfig);

  return remoteConfig;
}

async function initializeMockSetup(): Promise<{ [_: string]: any }> {
  const userDataDirectory = resolveUserDataDirectory();
  const remoteConfigBuffer = fs.readFileSync(`${userDataDirectory}/remoteConfig.json`);
  const remoteConfig = JSON.parse(remoteConfigBuffer.toString());

  return getDefaultConfig(remoteConfig);
}

export const FirebaseRemoteConfigProvider = ({ children }: Props): JSX.Element => {
  const [config, setConfig] = useState<RemoteConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      if (process.env.PLAYWRIGHT_RUN) {
        setConfig((await initializeMockSetup()) as RemoteConfig);
      } else {
        setConfig(await initializeFirebase());
      }
    };
    fetchConfig();
  }, [setConfig]);

  return (
    <FirebaseRemoteConfigContext.Provider value={config}>
      {children}
    </FirebaseRemoteConfigContext.Provider>
  );
};
