import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  connectAuthEmulator,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Bun inlines process.env.BUN_PUBLIC_* at bundle time — bracket notation
// (process.env[key]) is NOT inlined and will throw in the browser.
const apiKey = process.env.BUN_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.BUN_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.BUN_PUBLIC_FIREBASE_PROJECT_ID;
const appId = process.env.BUN_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.BUN_PUBLIC_FIREBASE_MEASUREMENT_ID;

const missing = [
  !apiKey && "BUN_PUBLIC_FIREBASE_API_KEY",
  !authDomain && "BUN_PUBLIC_FIREBASE_AUTH_DOMAIN",
  !projectId && "BUN_PUBLIC_FIREBASE_PROJECT_ID",
  !appId && "BUN_PUBLIC_FIREBASE_APP_ID",
].filter(Boolean);
if (missing.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missing.join(", ")}`);
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  appId,
  measurementId,
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

// Analytics is only active in production (no emulator equivalent, and
// measurementId may not be set in dev).
export const analyticsPromise =
  process.env.NODE_ENV === "production"
    ? isSupported().then((ok) => (ok ? getAnalytics(app) : null))
    : Promise.resolve(null);
