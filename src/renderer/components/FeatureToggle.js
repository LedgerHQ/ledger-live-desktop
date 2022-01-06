import { getValue } from "firebase/remote-config";

import { useFirebaseRemoteConfig } from "./FirebaseRemoteConfig";

const FeatureToggle = ({ feature, fallback, children }) => {
  const remoteConfig = useFirebaseRemoteConfig();

  if (!remoteConfig || !getValue(remoteConfig, feature).asBoolean()) {
    return fallback;
  }

  return children;
};

export default FeatureToggle;
