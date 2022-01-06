import React, { ReactNode, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, RemoteConfig } from "firebase/remote-config";

export const FirebaseRemoteConfigContext = React.createContext<RemoteConfig | null>(null);

export const useFirebaseRemoteConfig = () => useContext(FirebaseRemoteConfigContext);

const firebaseCredentials = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseDefaultConfig = {
  feature_receive: true,
};

type Props = {
  children?: ReactNode;
};

export const FirebaseRemoteConfigProvider = ({ children }: Props): JSX.Element => {
  const [config, setConfig] = useState<RemoteConfig | null>(null);

  useEffect(() => {
    initializeApp(firebaseCredentials);

    const fetchConfig = async () => {
      const remoteConfig = getRemoteConfig();
      remoteConfig.defaultConfig = firebaseDefaultConfig;
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
