/**
 * Seeds eventInfo/main in Firestore with the initial timeline.
 * When FIREBASE_AUTH_EMULATOR_HOST is set, also creates admin@test.local
 * in the Auth emulator and grants it admin access.
 *
 * Against the emulator:
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 bun run seed
 *
 * Against production (uses credentials from `firebase login`):
 *   bun run seed
 */
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { type TimelineEntry } from "@/lib/schemas";

const TIMELINE: TimelineEntry[] = [
  { id: "1", time: "4:20 PM", label: "Meet at Edmonds Ferry Terminal" },
  { id: "2", time: "4:45 PM", label: "Ferry Departure (foot passengers)" },
  { id: "3", time: "5:15 PM", label: "Arrive Kingston — shuttle pickup" },
  { id: "4", time: "6:15 PM", label: "Mocktail Hour & Photos" },
  { id: "5", time: "7:15 PM", label: "Sunset Dinner" },
  { id: "6", time: "8:30 PM", label: "Dancing & DJ" },
  { id: "7", time: "10:30 PM", label: "Fire Pit & S'mores" },
  {
    id: "8",
    time: "11:00 PM",
    label: "Overnight transition / optional pickup",
  },
  { id: "9", time: "9:00 AM", label: "Farewell Pancake Breakfast" },
  {
    id: "10",
    time: "10:30 AM",
    label: "Morning shuttles to Kingston Terminal",
  },
  { id: "11", time: "11:10 AM", label: "Return ferry to Edmonds" },
];

initializeApp({ projectId: "promdemic2026" });

const db = getFirestore();

await db.doc("eventInfo/main").set({
  timeline: TIMELINE,
  updatedAt: Timestamp.now(),
  updatedBy: "seed",
});
console.log(`✓ Seeded eventInfo/main with ${TIMELINE.length} entries.`);

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  const adminAuth = getAuth();
  const email = "admin@test.local";

  let uid: string;
  try {
    const existing = await adminAuth.getUserByEmail(email);
    uid = existing.uid;
  } catch {
    const created = await adminAuth.createUser({ email });
    uid = created.uid;
  }

  await db.doc(`admins/${uid}`).set({ email });
  console.log(`✓ Admin seeded: ${email} (uid: ${uid})`);
}

await db.terminate();
