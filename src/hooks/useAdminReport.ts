import { db } from "@/lib/firebase";
import {
  RsvpSchema,
  VolunteerSchema,
  type Rsvp,
  type Volunteer,
} from "@/lib/schemas";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export type RsvpRow = Rsvp & { uid: string };
export type VolunteerRow = Volunteer & { uid: string };

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; rsvps: RsvpRow[]; volunteers: VolunteerRow[] }
  | { status: "error" };

export const useAdminReport = (isAdmin: boolean) => {
  const [state, setState] = useState<State>({ status: "idle" });

  const fetch = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const [rsvpSnap, volunteerSnap] = await Promise.all([
        getDocs(collection(db, "rsvps")),
        getDocs(collection(db, "volunteers")),
      ]);

      const rsvps: RsvpRow[] = [];
      rsvpSnap.forEach((doc) => {
        const parsed = RsvpSchema.safeParse(doc.data());
        if (parsed.success) rsvps.push({ ...parsed.data, uid: doc.id });
      });

      const volunteers: VolunteerRow[] = [];
      volunteerSnap.forEach((doc) => {
        const parsed = VolunteerSchema.safeParse(doc.data());
        if (parsed.success) volunteers.push({ ...parsed.data, uid: doc.id });
      });

      rsvps.sort((a, b) => a.name.localeCompare(b.name));
      volunteers.sort((a, b) => a.name.localeCompare(b.name));

      setState({ status: "ready", rsvps, volunteers });
    } catch (err) {
      console.error("Failed to load admin report:", err);
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetch();
  }, [isAdmin, fetch]);

  return { state, refresh: fetch };
};
