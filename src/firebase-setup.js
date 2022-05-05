export function getFirebaseConfig() {
  if (process.env.FIREBASE_API_KEY) {
    return {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };
  } else {
    return {
      apiKey: "AIzaSyDh7WKaA5cvXV1C554Djyd68vy_1LrXxhk",
      authDomain: "ledger-live-development.firebaseapp.com",
      projectId: "ledger-live-development",
      storageBucket: "ledger-live-development.appspot.com",
      messagingSenderId: "750497694072",
      appId: "1:750497694072:web:d2fc719100b45405bac88d",
    };
  }
}
