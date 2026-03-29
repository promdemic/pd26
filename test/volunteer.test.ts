/**
 * Firestore security rules tests for the volunteers collection.
 * Requires emulators: firebase emulators:start --only firestore,auth
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, describe, test } from "bun:test";

const PROJECT_ID = "promdemic2026";
const RULES = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const TEST_VOLUNTEER = { name: "Grace Hopper", role: "Ferry Chaperones", email: "grace@example.com" };

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: "127.0.0.1", port: 8080, rules: RULES },
  });
});

afterAll(() => testEnv.cleanup());

describe("volunteers rules", () => {
  test("authenticated user can write their own volunteer doc", async () => {
    const db = testEnv.authenticatedContext("parent-uid").firestore();
    await assertSucceeds(setDoc(doc(db, "volunteers", "parent-uid"), TEST_VOLUNTEER));
  });

  test("authenticated user can read their own volunteer doc", async () => {
    const db = testEnv.authenticatedContext("parent-uid").firestore();
    await assertSucceeds(getDoc(doc(db, "volunteers", "parent-uid")));
  });

  test("authenticated user can read another user's volunteer doc (for slot counting)", async () => {
    const db = testEnv.authenticatedContext("other-uid").firestore();
    await assertSucceeds(getDocs(collection(db, "volunteers")));
  });

  test("authenticated user cannot write to another user's volunteer doc", async () => {
    const db = testEnv.authenticatedContext("other-uid").firestore();
    await assertFails(setDoc(doc(db, "volunteers", "parent-uid"), TEST_VOLUNTEER));
  });
});
