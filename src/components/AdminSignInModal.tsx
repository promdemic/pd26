import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminReportModal from "@/components/AdminReportModal";
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
  const [reportOpen, setReportOpen] = useState(false);

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
          <DialogTitle className="text-navy">Admin</DialogTitle>
          <DialogDescription className="sr-only">
            Sign in with Google to access admin controls.
          </DialogDescription>
        </DialogHeader>

        {state.status === "loading" && (
          <p className="text-sm text-navy/60">Loading…</p>
        )}

        {state.status === "unauthenticated" && (
          <div className="space-y-3">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              onClick={handleSignIn}
              disabled={busy}
              className="w-full bg-navy text-white hover:bg-navy/90"
            >
              {busy ? "Signing in…" : "Sign in with Google"}
            </Button>
          </div>
        )}

        {state.status === "authenticated" && !state.isAdmin && (
          <div className="space-y-3">
            <p className="text-sm text-navy/70">
              Signed in as{" "}
              <span className="font-medium">{state.user.email}</span>, but this
              account does not have admin access.
            </p>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              Sign out
            </Button>
          </div>
        )}

        {state.status === "authenticated" && state.isAdmin && (
          <div className="space-y-3">
            <p className="text-sm text-navy/70">
              Signed in as{" "}
              <span className="font-medium text-navy">{state.user.email}</span>
            </p>
            <Button
              onClick={() => setReportOpen(true)}
              className="w-full bg-gold text-navy hover:bg-[#b8943d]"
            >
              View Report
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              Sign out
            </Button>
          </div>
        )}

        <AdminReportModal open={reportOpen} onOpenChange={setReportOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AdminSignInModal;
