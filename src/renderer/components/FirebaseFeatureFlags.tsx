import React, { ReactNode } from "react";
import { FeatureFlagsProvider } from "@ledgerhq/live-common/lib/featureFlags";
import { Feature, FeatureId } from "@ledgerhq/live-common/lib/types";
import { getValue } from "firebase/remote-config";

import { formatFeatureId, useFirebaseRemoteConfig } from "./FirebaseRemoteConfig";

type Props = {
  children?: ReactNode;
};

export const FirebaseFeatureFlagsProvider = ({ children }: Props): JSX.Element => {
  const remoteConfig = useFirebaseRemoteConfig();

  const getFeature = (key: FeatureId): Feature | null => {
    if (!remoteConfig) {
      return null;
    }

    let jsonValue: string;
    try {
      jsonValue = getValue(remoteConfig, formatFeatureId(key)).asString();
    } catch (error) {
      if (process.env.PLAYWRIGHT_RUN) {
        jsonValue = remoteConfig[formatFeatureId(key)];
      } else {
        console.error(`Failed to retrieve feature "${key}"`);
        return null;
      }
    }

    const feature: Feature = JSON.parse(jsonValue);

    return feature;
  };

  return <FeatureFlagsProvider getFeature={getFeature}>{children}</FeatureFlagsProvider>;
};
