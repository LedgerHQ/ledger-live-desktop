export const firebaseDevelopmentConfig = {
  apiKey: "AIzaSyDh7WKaA5cvXV1C554Djyd68vy_1LrXxhk",
  authDomain: "ledger-live-development.firebaseapp.com",
  projectId: "ledger-live-development",
  storageBucket: "ledger-live-development.appspot.com",
  messagingSenderId: "750497694072",
  appId: "1:750497694072:web:d2fc719100b45405bac88d",
};

// We don't have the concept of staging on desktop but the
// Firebase project still exists
export const firebaseStagingConfig = {
  apiKey: "AIzaSyCqosqFLVHMsMi3uOFFbCJItOby7i6Y4T8",
  authDomain: "ledger-live-staging.firebaseapp.com",
  projectId: "ledger-live-staging",
  storageBucket: "ledger-live-staging.appspot.com",
  messagingSenderId: "1008987457941",
  appId: "1:1008987457941:web:14f6fbee631e0438d6ce9c",
};

export const firebaseProductionConfig = {
  apiKey: "AIzaSyAzrQM75b6VXVwRzEDAM12ijfeOHlXvhA8",
  authDomain: "ledger-live-production.firebaseapp.com",
  projectId: "ledger-live-production",
  storageBucket: "ledger-live-production.appspot.com",
  messagingSenderId: "212042068804",
  appId: "1:212042068804:web:268d6f11671689c0b51d11",
};

export function getFirebaseConfig() {
  if (__DEV__) {
    return firebaseDevelopmentConfig;
  }

  return firebaseProductionConfig;
}
