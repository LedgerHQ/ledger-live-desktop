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

    try {
      const value = getValue(remoteConfig, formatFeatureId(key));
      const feature: Feature = JSON.parse(value.asString());

      return feature;
    } catch (error) {
      console.error(`Failed to retrieve feature "${key}"`);
      return null;
    }
  };

  return <FeatureFlagsProvider getFeature={getFeature}>{children}</FeatureFlagsProvider>;
};
