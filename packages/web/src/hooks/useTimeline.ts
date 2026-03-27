import { db } from "@/lib/firebase";
import { EventInfoSchema, type TimelineEntry } from "@pd26/schemas";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type State =
  | { status: "loading" }
  | { status: "success"; entries: TimelineEntry[] }
  | { status: "error" };

export const useTimeline = (editingRef: React.RefObject<boolean>) => {
  const [state, setState] = useState<State>({ status: "loading" });
  const pendingRef = useRef<TimelineEntry[] | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "eventInfo", "main"),
      (snap) => {
        const { data, error, success } = EventInfoSchema.safeParse(snap.data());
        if (!success) {
          console.error("Failed to parse timeline data:", error);
          setState({ status: "error" });
          return;
        }
        const entries = data.timeline;
        if (editingRef.current) {
          pendingRef.current = entries;
        } else {
          setState({ status: "success", entries });
        }
      },
      () => {
        setState({ status: "error" });
      },
    );
    return unsub;
  }, [editingRef]);

  const flushPending = () => {
    if (pendingRef.current) {
      setState({ status: "success", entries: pendingRef.current });
      pendingRef.current = null;
    }
  };

  const saveTimeline = async (entries: TimelineEntry[], uid: string) => {
    await setDoc(doc(db, "eventInfo", "main"), {
      timeline: entries,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  };

  return { state, saveTimeline, flushPending };
};
