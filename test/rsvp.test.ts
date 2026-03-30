/**
 * Firestore security rules tests for the rsvps collection.
 * Requires emulators: firebase emulators:start --only firestore,auth
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, describe, test } from "bun:test";

const PROJECT_ID = "promdemic2026";
const RULES = readFileSync(
  new URL("../firestore.rules", import.meta.url),
  "utf8",
);
const TEST_RSVP = {
  name: "Ada Lovelace",
  dietary: "",
  songs: "",
  overnight: true,
};

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: "127.0.0.1", port: 8080, rules: RULES },
  });
});

afterAll(() => testEnv.cleanup());

describe("rsvps rules", () => {
  test("authenticated user can write their own rsvp", async () => {
    const db = testEnv.authenticatedContext("student-uid").firestore();
    await assertSucceeds(setDoc(doc(db, "rsvps", "student-uid"), TEST_RSVP));
  });

  test("authenticated user can read their own rsvp", async () => {
    const db = testEnv.authenticatedContext("student-uid").firestore();
    await assertSucceeds(getDoc(doc(db, "rsvps", "student-uid")));
  });

  test("authenticated user cannot write to another user's rsvp", async () => {
    const db = testEnv.authenticatedContext("other-uid").firestore();
    await assertFails(setDoc(doc(db, "rsvps", "student-uid"), TEST_RSVP));
  });
});
