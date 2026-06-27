import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton — Next.js hot-reload sırasında çift init'i önler
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Sadece roysdekors@gmail.com admin olabilir
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "roysdekors@gmail.com";

// Magic Link için actionCodeSettings
// Firebase Console → Authentication > Sign-in method > Email link (passwordless) altına
// bu URL'i "Authorized domains" listesine eklemeyi unutma.
export const actionCodeSettings = {
  // Callback URL — her zaman kendi origin'e döner; prod'da .env.local'dan alınır
  url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/auth-callback`,
  handleCodeInApp: true,
};

export { app, auth, db, storage, googleProvider };
