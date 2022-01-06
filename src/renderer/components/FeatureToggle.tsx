import { ReactNode } from "react";
import { getValue } from "firebase/remote-config";

import { useFirebaseRemoteConfig } from "./FirebaseRemoteConfig";

type Props = {
  feature: string;
  fallback?: ReactNode;
  children?: ReactNode;
};

const FeatureToggle = ({ feature, fallback, children }: Props) => {
  const remoteConfig = useFirebaseRemoteConfig();

  if (!remoteConfig || !getValue(remoteConfig, feature).asBoolean()) {
    return fallback;
  }

  return children;
};

export default FeatureToggle;
