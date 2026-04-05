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
import FormSkeleton from "@/components/FormSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRsvp } from "@/hooks/useRsvp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const RSVPFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dietary: z.string().optional(),
  songs: z.string().optional(),
  overnight: z.enum(["yes", "no"], { error: "Please select an option" }),
  committed: z.literal(true, { error: "You must agree before submitting" }),
});

type RSVPFormValues = z.infer<typeof RSVPFormSchema>;

const SKELETON_ROWS = ["w-full", "w-full", "w-full", "w-32"];

const RSVPForm = () => {
  const { state: authState, signInWithGoogle } = useAuth();
  const uid = authState.status === "authenticated" ? authState.user.uid : null;
  const { state: rsvpState, save } = useRsvp(uid);

  const [expanded, setExpanded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(RSVPFormSchema),
    defaultValues: {
      name: "",
      dietary: "",
      songs: "",
      overnight: undefined,
      committed: undefined,
    },
  });

  const nameValue = watch("name");

  const handleSignIn = () => {
    setExpanded(true);
    if (authState.status !== "authenticated") signInWithGoogle();
  };

  // Pre-fill form when existing RSVP loads
  useEffect(() => {
    if (rsvpState.status === "ready" && rsvpState.rsvp) {
      const { name, dietary, songs, overnight } = rsvpState.rsvp;
      reset({
        name: name ?? "",
        dietary: dietary ?? "",
        songs: songs ?? "",
        overnight: overnight ? "yes" : "no",
        committed: true,
      });
    }
  }, [rsvpState.status, reset]);

  const onSubmit = async (data: RSVPFormValues) => {
    setSubmitError("");
    setSubmitStatus("submitting");
    try {
      await save({
        name: data.name,
        dietary: data.dietary,
        songs: data.songs,
        overnight: data.overnight === "yes",
      });
      setSubmitStatus("success");
    } catch {
      setSubmitError("Something went wrong — please try again.");
      setSubmitStatus("idle");
    }
  };

  // ── Success view ──────────────────────────────────────────────────────────
  if (submitStatus === "success") {
    return (
      <section id="rsvp" className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-navy">
            You're on the list!
          </h2>
          <p className="mb-6 text-muted-foreground">
            We've got your RSVP, {nameValue}. See you on the Bay!
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitStatus("idle")}
            className="border-navy/30 text-navy"
          >
            Edit your RSVP
          </Button>
        </div>
      </section>
    );
  }

  // ── Auth / loading states ─────────────────────────────────────────────────
  // "unauthenticated" is treated as loading here because expanded becomes true
  // immediately on click, before the Google sign-in popup resolves.
  const isLoading =
    expanded &&
    (authState.status === "loading" ||
      authState.status === "unauthenticated" ||
      (authState.status === "authenticated" && rsvpState.status === "loading"));

  return (
    <section id="rsvp" className="bg-navy px-6 py-20">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
          Student RSVP
        </h2>
        <p className="mb-8 text-center text-white/70">
          Secure your spot for Promdemic 2026
        </p>

        {!expanded ? (
          <div className="text-center">
            <Button
              onClick={handleSignIn}
              size="lg"
              disabled={authState.status === "loading"}
              className="bg-gold text-navy hover:bg-[#b8943d] disabled:opacity-70"
            >
              {authState.status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : authState.status === "authenticated" ? (
                "Click here to RSVP"
              ) : (
                "Sign in with Google to RSVP"
              )}
            </Button>
          </div>
        ) : (
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">
                {rsvpState.status === "ready" && rsvpState.rsvp
                  ? "Update your RSVP"
                  : "Your Info"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <FormSkeleton rows={SKELETON_ROWS} variant="dark" />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-white/90">
                      Full Name <span className="text-gold">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your name"
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dietary" className="text-white/90">
                      Dietary Needs
                    </Label>
                    <Input
                      id="dietary"
                      {...register("dietary")}
                      placeholder="e.g. vegetarian, nut allergy…"
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="songs" className="text-white/90">
                      Song Requests
                    </Label>
                    <Textarea
                      id="songs"
                      {...register("songs")}
                      placeholder="Any songs you'd love to hear?"
                      rows={3}
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="overnight" className="text-white/90">
                      Staying Overnight? <span className="text-gold">*</span>
                    </Label>
                    <Controller
                      name="overnight"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="border-white/20 bg-white/10 text-white">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">
                              Yes — staying overnight
                            </SelectItem>
                            <SelectItem value="no">
                              No — picking up at 11 PM
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.overnight && (
                      <p className="text-xs text-red-400">
                        {errors.overnight.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name="committed"
                    control={control}
                    render={({ field }) => (
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={field.value === true}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? true : undefined)
                          }
                          className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
                        />
                        <span className="text-sm text-white/80">
                          I commit to being respectful of other guests, the
                          house, and the neighbors. I understand that if I'm
                          not, I'll need to go home.
                        </span>
                      </label>
                    )}
                  />
                  {errors.committed && (
                    <p className="text-xs text-red-400">
                      {errors.committed.message}
                    </p>
                  )}

                  {submitError && (
                    <p className="text-sm text-red-400">{submitError}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitStatus === "submitting"}
                    className="w-full bg-gold text-navy hover:bg-[#b8943d] disabled:opacity-50"
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
