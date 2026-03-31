import { db } from "@/lib/firebase";
import { VOLUNTEER_ROLES, type VolunteerRole } from "@/lib/volunteers";
import { VolunteerSchema, type Volunteer } from "@/lib/schemas";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; volunteer: Volunteer | null };

export const useVolunteer = (uid: string | null) => {
  const [state, setState] = useState<State>(
    uid ? { status: "loading" } : { status: "idle" },
  );
  const [counts, setCounts] = useState<Record<VolunteerRole, number> | null>(
    null,
  );

  const fetchCounts = async () => {
    const snap = await getDocs(collection(db, "volunteers"));
    const c = Object.fromEntries(
      Object.keys(VOLUNTEER_ROLES).map((r) => [r, 0]),
    ) as Record<VolunteerRole, number>;
    snap.forEach((d) => {
      const role = d.data().role as VolunteerRole;
      if (role in c) c[role]++;
    });
    setCounts(c);
  };

  useEffect(() => {
    if (!uid) {
      setState({ status: "idle" });
      return;
    }
    setState({ status: "loading" });
    Promise.all([getDoc(doc(db, "volunteers", uid)), fetchCounts()]).then(
      ([snap]) => {
        if (!snap.exists()) {
          setState({ status: "ready", volunteer: null });
          return;
        }
        const parsed = VolunteerSchema.safeParse(snap.data());
        setState({
          status: "ready",
          volunteer: parsed.success ? parsed.data : null,
        });
      },
    );
  }, [uid]);

  const save = async (data: Volunteer) => {
    if (!uid) throw new Error("save() called without an authenticated uid");
    await setDoc(doc(db, "volunteers", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    await fetchCounts();
  };

  return { state, counts, save };
};
