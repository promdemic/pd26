import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AdminSignInModal = ({ open, onOpenChange }: Props) => {
  const { state, signInWithGoogle, signOut } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#1a2744]">Admin</DialogTitle>
        </DialogHeader>

        {state.status === "loading" && (
          <p className="text-sm text-[#1a2744]/60">Loading…</p>
        )}

        {state.status === "unauthenticated" && (
          <div className="space-y-3">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              onClick={handleSignIn}
              disabled={busy}
              className="w-full bg-[#1a2744] text-white hover:bg-[#1a2744]/90"
            >
              {busy ? "Signing in…" : "Sign in with Google"}
            </Button>
          </div>
        )}

        {state.status === "authenticated" && !state.isAdmin && (
          <div className="space-y-3">
            <p className="text-sm text-[#1a2744]/70">
              Signed in as{" "}
              <span className="font-medium">{state.user.email}</span>, but this
              account does not have admin access.
            </p>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              Sign out
            </Button>
          </div>
        )}

        {state.status === "authenticated" && state.isAdmin && (
          <div className="space-y-3">
            <p className="text-sm text-[#1a2744]/70">
              Signed in as{" "}
              <span className="font-medium text-[#1a2744]">{state.user.email}</span>
            </p>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              Sign out
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminSignInModal;
