/**
 * Firestore security rules tests.
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
const TEST_DOC = {
  timeline: [{ id: "1", time: "4:20 PM", label: "Meet at Ferry" }],
};

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: "127.0.0.1", port: 8080, rules: RULES },
  });

  // Seed admins collection (bypasses rules)
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "admins", "admin-uid"), {
      email: "admin@test.local",
    });
    await setDoc(doc(ctx.firestore(), "eventInfo", "main"), TEST_DOC);
  });
});

afterAll(() => testEnv.cleanup());

describe("eventInfo rules", () => {
  test("unauthenticated read succeeds", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(db, "eventInfo", "main")));
  });

  test("unauthenticated write is rejected", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(db, "eventInfo", "main"), TEST_DOC));
  });

  test("admin write succeeds", async () => {
    const db = testEnv.authenticatedContext("admin-uid").firestore();
    await assertSucceeds(setDoc(doc(db, "eventInfo", "main"), TEST_DOC));
  });
});
