import { db } from "@/lib/firebase";
import {
  EventInfoSchema,
  type InfoItem,
  type TimelineEntry,
} from "@/lib/schemas";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type SuccessState = {
  status: "success";
  entries: TimelineEntry[];
  gettingThere?: InfoItem[];
  food?: InfoItem[];
  overnight?: InfoItem[];
};

type State = { status: "loading" } | SuccessState | { status: "error" };

export const useTimeline = (editingRef: React.RefObject<boolean>) => {
  const [state, setState] = useState<State>({ status: "loading" });
  const pendingRef = useRef<SuccessState | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "eventInfo", "main"),
      (snap) => {
        if (!snap.exists()) {
          setState({ status: "success", entries: [] });
          return;
        }
        const parsed = EventInfoSchema.safeParse(snap.data());
        if (!parsed.success) {
          console.error("Failed to parse timeline data:", parsed.error);
          setState({ status: "error" });
          return;
        }
        const next: SuccessState = {
          status: "success",
          entries: parsed.data.timeline,
          gettingThere: parsed.data.gettingThere,
          food: parsed.data.food,
          overnight: parsed.data.overnight,
        };
        if (editingRef.current) {
          pendingRef.current = next;
        } else {
          setState(next);
        }
      },
      () => setState({ status: "error" }),
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // editingRef is a stable ref object — its .current changes but the ref itself never does

  const flushPending = () => {
    if (pendingRef.current) {
      setState(pendingRef.current);
      pendingRef.current = null;
    }
  };

  const saveTimeline = async (entries: TimelineEntry[], uid: string) => {
    await setDoc(
      doc(db, "eventInfo", "main"),
      { timeline: entries, updatedAt: serverTimestamp(), updatedBy: uid },
      { merge: true },
    );
  };

  const saveSection = async (
    field: "gettingThere" | "food" | "overnight",
    items: InfoItem[],
    uid: string,
  ) => {
    await setDoc(
      doc(db, "eventInfo", "main"),
      { [field]: items, updatedAt: serverTimestamp(), updatedBy: uid },
      { merge: true },
    );
  };

  return { state, saveTimeline, saveSection, flushPending };
};
