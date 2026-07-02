import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Singleton — Next.js hot-reload ve Edge invocation'larında çift init'i önler
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) throw new Error("FIREBASE_PRIVATE_KEY eksik");

  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env dosyasındaki literal \n karakterlerini gerçek satır sonu yapar
      privateKey:  privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = getFirestore();
