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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useRsvp } from "@/hooks/useRsvp";
import { useEffect, useState } from "react";

type FormState = {
  name: string;
  dietary: string;
  songs: string;
  overnight: string; // "yes" | "no" | ""
};

const EMPTY_FORM: FormState = { name: "", dietary: "", songs: "", overnight: "" };

const SKELETON_WIDTHS = ["w-full", "w-full", "w-full", "w-32"];

const FormSkeleton = () => (
  <div className="space-y-5">
    {SKELETON_WIDTHS.map((w, i) => (
      <div key={i} className="space-y-1.5">
        <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
        <div className={`h-10 ${w} animate-pulse rounded bg-white/10`} />
      </div>
    ))}
  </div>
);

const RSVPForm = () => {
  const { state: authState, signInWithGoogle } = useAuth();
  const uid = authState.status === "authenticated" ? authState.user.uid : null;
  const { state: rsvpState, save } = useRsvp(uid);

  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    setExpanded(true);
    if (authState.status !== "authenticated") signInWithGoogle();
  };

  // Pre-fill form when existing RSVP loads
  useEffect(() => {
    if (rsvpState.status === "ready" && rsvpState.rsvp) {
      const { name, dietary, songs, overnight } = rsvpState.rsvp;
      setForm({
        name: name ?? "",
        dietary: dietary ?? "",
        songs: songs ?? "",
        overnight: overnight ? "yes" : "no",
      });
    }
  }, [rsvpState.status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitStatus("submitting");
    try {
      await save({ name: form.name, dietary: form.dietary, songs: form.songs, overnight: form.overnight === "yes" });
      setSubmitStatus("success");
    } catch {
      setError("Something went wrong — please try again.");
      setSubmitStatus("idle");
    }
  };

  // ── Success view ──────────────────────────────────────────────────────────
  if (submitStatus === "success") {
    return (
      <section id="rsvp" className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-[#1a2744]">You're on the list!</h2>
          <p className="mb-6 text-[#5a6a8a]">We've got your RSVP, {form.name}. See you on the Bay!</p>
          <Button
            variant="outline"
            onClick={() => setSubmitStatus("idle")}
            className="border-[#1a2744]/30 text-[#1a2744]"
          >
            Edit your RSVP
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
      (authState.status === "authenticated" && rsvpState.status === "loading"));

  return (
    <section id="rsvp" className="bg-[#1a2744] px-6 py-20">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
          Student RSVP
        </h2>
        <p className="mb-8 text-center text-white/70">Secure your spot for Promdemic 2026</p>

        {!expanded ? (
          <div className="text-center">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d]"
            >
              Sign in with Google to RSVP
            </Button>
          </div>
        ) : (
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">
                {rsvpState.status === "ready" && rsvpState.rsvp ? "Update your RSVP" : "Your Info"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <FormSkeleton />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-white/90">
                      Full Name <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dietary" className="text-white/90">Dietary Needs</Label>
                    <Input
                      id="dietary"
                      name="dietary"
                      value={form.dietary}
                      onChange={handleChange}
                      placeholder="e.g. vegetarian, nut allergy…"
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="songs" className="text-white/90">Song Requests</Label>
                    <Textarea
                      id="songs"
                      name="songs"
                      value={form.songs}
                      onChange={handleChange}
                      placeholder="Any songs you'd love to hear?"
                      rows={3}
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="overnight" className="text-white/90">
                      Staying Overnight? <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Select
                      value={form.overnight}
                      onValueChange={(v) => setForm((prev) => ({ ...prev, overnight: v }))}
                    >
                      <SelectTrigger className="border-white/20 bg-white/10 text-white">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes — staying overnight</SelectItem>
                        <SelectItem value="no">No — picking up at 11 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitStatus === "submitting" || !form.name || !form.overnight}
                    className="w-full bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d] disabled:opacity-50"
                  >
                    {submitStatus === "submitting"
                      ? "Saving…"
                      : rsvpState.status === "ready" && rsvpState.rsvp
                        ? "Update RSVP"
                        : "Submit RSVP"}
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

export default RSVPForm;
