import { auth, db, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: User; isAdmin: boolean };

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ status: "unauthenticated" });
        return;
      }
      const snap = await getDoc(doc(db, "admins", user.uid));
      setState({ status: "authenticated", user, isAdmin: snap.exists() });
    });
    return unsub;
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  const signOut = () => firebaseSignOut(auth);

  return { state, signInWithGoogle, signOut };
};
