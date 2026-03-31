import { db } from "@/lib/firebase";
import { RsvpSchema, type Rsvp } from "@/lib/schemas";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; rsvp: Rsvp | null };

export const useRsvp = (uid: string | null) => {
  const [state, setState] = useState<State>(
    uid ? { status: "loading" } : { status: "idle" },
  );

  useEffect(() => {
    if (!uid) {
      setState({ status: "idle" });
      return;
    }
    setState({ status: "loading" });
    getDoc(doc(db, "rsvps", uid))
      .then((snap) => {
        if (!snap.exists()) {
          setState({ status: "ready", rsvp: null });
          return;
        }
        const parsed = RsvpSchema.safeParse(snap.data());
        setState({ status: "ready", rsvp: parsed.success ? parsed.data : null });
      })
      .catch((err) => {
        console.error("Failed to load RSVP:", err);
        setState({ status: "ready", rsvp: null });
      });
  }, [uid]);

  const save = async (data: Rsvp) => {
    if (!uid) throw new Error("save() called without an authenticated uid");
    await setDoc(doc(db, "rsvps", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  return { state, save };
};
