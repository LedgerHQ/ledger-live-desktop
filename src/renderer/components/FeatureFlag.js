import { getValue } from "firebase/remote-config";

import { useFirebaseRemoteConfig } from "./FirebaseRemoteConfig";

const FeatureFlag = ({ feature, fallback, children }) => {
  const remoteConfig = useFirebaseRemoteConfig();

  if (!remoteConfig || !getValue(remoteConfig, `feature_${feature}`).asBoolean()) {
    return fallback;
  }

  return children;
};

export default FeatureFlag;
