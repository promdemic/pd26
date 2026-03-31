import { getApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { REQUIRED_FIREBASE_ENV } from "@/lib/firebaseEnv";

const missing = REQUIRED_FIREBASE_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missing.join(", ")}`);
}

const firebaseConfig = {
  apiKey: process.env.BUN_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.BUN_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.BUN_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.BUN_PUBLIC_FIREBASE_APP_ID,
} as Record<string, string>;

const isNewApp = getApps().length === 0;
const app = isNewApp ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Only connect on fresh init — prevents double-connect errors under HMR
if (process.env.NODE_ENV !== "production" && isNewApp) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}
