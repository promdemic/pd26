import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useVolunteer } from "@/hooks/useVolunteer";
import { VOLUNTEER_ROLES, type VolunteerRole } from "@/lib/volunteers";
import { useEffect, useState } from "react";

type FormState = {
  name: string;
  role: string;
};

const EMPTY_FORM: FormState = { name: "", role: "" };

const SKELETON_WIDTHS = ["w-full", "w-full"];

const FormSkeleton = () => (
  <div className="space-y-5">
    {SKELETON_WIDTHS.map((w, i) => (
      <div key={i} className="space-y-1.5">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className={`h-10 ${w} animate-pulse rounded bg-gray-100`} />
      </div>
    ))}
  </div>
);

const VolunteerForm = () => {
  const { state: authState, signInWithGoogle } = useAuth();
  const uid = authState.status === "authenticated" ? authState.user.uid : null;
  const { state: volunteerState, counts, save } = useVolunteer(uid);

  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    setExpanded(true);
    if (authState.status !== "authenticated") signInWithGoogle();
  };

  // Pre-fill form when existing volunteer signup loads
  useEffect(() => {
    if (volunteerState.status === "ready" && volunteerState.volunteer) {
      const { name, role } = volunteerState.volunteer;
      setForm({ name: name ?? "", role: role ?? "" });
    }
  }, [volunteerState.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authState.status !== "authenticated") return;
    setError("");
    setSubmitStatus("submitting");
    try {
      await save({ name: form.name, role: form.role, email: authState.user.email ?? "" });
      setSubmitStatus("success");
    } catch {
      setError("Something went wrong — please try again.");
      setSubmitStatus("idle");
    }
  };

  // ── Success view ──────────────────────────────────────────────────────────
  if (submitStatus === "success") {
    return (
      <section id="volunteer" className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl">🙌</div>
          <h2 className="mb-2 text-2xl font-bold text-[#1a2744]">Thank you, {form.name}!</h2>
          <p className="mb-6 text-[#5a6a8a]">
            You're signed up as <strong>{form.role}</strong>. We'll be in touch with details soon.
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitStatus("idle")}
            className="border-[#1a2744]/30 text-[#1a2744]"
          >
            Edit your signup
          </Button>
        </div>
      </section>
    );
  }

  // ── Auth / loading states ─────────────────────────────────────────────────
  const isLoading =
    expanded &&
    (authState.status === "loading" ||
      authState.status === "unauthenticated" ||
      (authState.status === "authenticated" && volunteerState.status === "loading"));

  return (
    <section id="volunteer" className="px-6 py-20">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#1a2744] sm:text-4xl">
          Parent Volunteers
        </h2>
        <p className="mb-8 text-center text-[#5a6a8a]">
          This event runs on parent power. Sign up for a role below.
        </p>

        {!expanded ? (
          <div className="text-center">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d]"
            >
              Sign in with Google to volunteer
            </Button>
          </div>
        ) : (
          <Card className="border-[#d4c8b8]">
            <CardHeader>
              <CardTitle className="text-[#1a2744]">
                {volunteerState.status === "ready" && volunteerState.volunteer
                  ? "Update your signup"
                  : "Sign Up"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <FormSkeleton />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-name">
                      Full Name <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Input
                      id="vol-name"
                      name="name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="vol-role">
                      Role <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Select
                      value={form.role}
                      onValueChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
                    >
                      <SelectTrigger id="vol-role">
                        <SelectValue placeholder="Choose a role…" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(VOLUNTEER_ROLES) as [VolunteerRole, number][]).map(
                          ([role, capacity]) => {
                            const filled = counts?.[role] ?? 0;
                            // If the parent already holds this role, don't count themselves
                            const isSelf =
                              volunteerState.status === "ready" &&
                              volunteerState.volunteer?.role === role;
                            const available = capacity - filled + (isSelf ? 1 : 0);
                            const isFull = available <= 0;
                            return (
                              <SelectItem
                                key={role}
                                value={role}
                                disabled={isFull}
                                className={isFull ? "opacity-40" : ""}
                              >
                                {role}{" "}
                                <span className="text-[#c9a84c]">
                                  ({available} of {capacity} open)
                                </span>
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitStatus === "submitting" || !form.name || !form.role}
                    className="w-full bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d] disabled:opacity-50"
                  >
                    {submitStatus === "submitting"
                      ? "Saving…"
                      : volunteerState.status === "ready" && volunteerState.volunteer
                        ? "Update signup"
                        : "Sign up to volunteer"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default VolunteerForm;
