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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const VolunteerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  overnight: z.enum(["yes", "no"], { error: "Please select an option" }),
});

type VolunteerFormValues = z.infer<typeof VolunteerFormSchema>;

const SKELETON_WIDTHS = ["w-full", "w-full", "w-32"];

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
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(VolunteerFormSchema),
    defaultValues: { name: "", role: "", overnight: undefined },
  });

  const nameValue = watch("name");
  const roleValue = watch("role");

  const handleSignIn = () => {
    setExpanded(true);
    if (authState.status !== "authenticated") signInWithGoogle();
  };

  // Pre-fill form when existing volunteer signup loads
  useEffect(() => {
    if (volunteerState.status === "ready" && volunteerState.volunteer) {
      const { name, role, overnight } = volunteerState.volunteer;
      reset({
        name: name ?? "",
        role: role ?? "",
        overnight: overnight ? "yes" : "no",
      });
    }
  }, [volunteerState.status, reset]);

  const onSubmit = async (data: VolunteerFormValues) => {
    if (authState.status !== "authenticated") return;
    setSubmitError("");
    setSubmitStatus("submitting");
    try {
      await save({
        name: data.name,
        role: data.role,
        email: authState.user.email ?? "",
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
      <section id="volunteer" className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl">🙌</div>
          <h2 className="mb-2 text-2xl font-bold text-[#1a2744]">
            Thank you, {nameValue}!
          </h2>
          <p className="mb-6 text-[#5a6a8a]">
            You're signed up as <strong>{roleValue}</strong>. We'll be in touch
            with details soon.
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
      (authState.status === "authenticated" &&
        volunteerState.status === "loading"));

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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-name">
                      Full Name <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Input
                      id="vol-name"
                      {...register("name")}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="vol-role">
                      Role <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="vol-role">
                            <SelectValue placeholder="Choose a role…" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.entries(VOLUNTEER_ROLES) as [
                                VolunteerRole,
                                number,
                              ][]
                            ).map(([role, capacity]) => {
                              const filled = counts?.[role] ?? 0;
                              const isSelf =
                                volunteerState.status === "ready" &&
                                volunteerState.volunteer?.role === role;
                              const available =
                                capacity - filled + (isSelf ? 1 : 0);
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
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && (
                      <p className="text-xs text-red-500">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="vol-overnight">
                      Staying Overnight?{" "}
                      <span className="text-[#c9a84c]">*</span>
                    </Label>
                    <Controller
                      name="overnight"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="vol-overnight">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">
                              Yes — staying overnight
                            </SelectItem>
                            <SelectItem value="no">
                              No — leaving after the event
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.overnight && (
                      <p className="text-xs text-red-500">
                        {errors.overnight.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitStatus === "submitting"}
                    className="w-full bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d] disabled:opacity-50"
                  >
                    {submitStatus === "submitting"
                      ? "Saving…"
                      : volunteerState.status === "ready" &&
                          volunteerState.volunteer
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
