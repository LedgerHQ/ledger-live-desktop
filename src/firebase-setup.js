const firebaseDevConfig = {
  apiKey: "AIzaSyAHlqjEgJ3fZ8Et7hMRepRpX_Vh_jZZdz0",
  authDomain: "ledger-live-12a1c.firebaseapp.com",
  projectId: "ledger-live-12a1c",
  storageBucket: "ledger-live-12a1c.appspot.com",
  messagingSenderId: "148270189806",
  appId: "1:148270189806:web:206ee6daad7a87679677ff",
};

const firebaseProdConfig = {
  apiKey: "AIzaSyAzrQM75b6VXVwRzEDAM12ijfeOHlXvhA8",
  authDomain: "ledger-live-production.firebaseapp.com",
  projectId: "ledger-live-production",
  storageBucket: "ledger-live-production.appspot.com",
  messagingSenderId: "212042068804",
  appId: "1:212042068804:web:268d6f11671689c0b51d11",
};

export function getFirebaseConfig() {
  if (__DEV__) {
    return firebaseDevConfig;
  }

  return firebaseProdConfig;
}
