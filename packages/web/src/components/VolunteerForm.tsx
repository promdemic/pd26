import { useState } from "react";
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
import { VOLUNTEER_ROLES, type VolunteerRole } from "@/lib/volunteers";

// Mock slot fill counts for Phase 1 (replaced with live Firestore data in Phase 3)
const MOCK_FILLED: Record<VolunteerRole, number> = {
  "Ferry Chaperones": 0,
  "Shuttle Drivers": 1,
  "Food Service": 2,
  "Breakfast Cooks": 0,
  "Cleanup Crew": 1,
};

interface FormState {
  name: string;
  email: string;
  role: string;
}

export default function VolunteerForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", role: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // Phase 3: wire to Firebase callable function
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <section id="volunteer" className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl">🙌</div>
          <h2 className="mb-2 text-2xl font-bold text-[#1a2744]">
            Thank you, {form.name}!
          </h2>
          <p className="text-[#5a6a8a]">
            You're signed up as <strong>{form.role}</strong>. We'll be in touch
            with details soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="volunteer" className="px-6 py-20">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#1a2744] sm:text-4xl">
          Parent Volunteers
        </h2>
        <p className="mb-8 text-center text-[#5a6a8a]">
          This event runs on parent power. Sign up for a role below.
        </p>

        <Card className="border-[#d4c8b8]">
          <CardHeader>
            <CardTitle className="text-[#1a2744]">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="vol-name">
                  Full Name <span className="text-[#c9a84c]">*</span>
                </Label>
                <Input
                  id="vol-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vol-email">
                  Email <span className="text-[#c9a84c]">*</span>
                </Label>
                <Input
                  id="vol-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vol-role">
                  Role <span className="text-[#c9a84c]">*</span>
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, role: v }))}
                  required
                >
                  <SelectTrigger id="vol-role">
                    <SelectValue placeholder="Choose a role…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(VOLUNTEER_ROLES) as [VolunteerRole, number][]).map(
                      ([role, capacity]) => {
                        const filled = MOCK_FILLED[role];
                        const available = capacity - filled;
                        const isFull = available === 0;
                        return (
                          <SelectItem
                            key={role}
                            value={role}
                            disabled={isFull}
                            className={isFull ? "opacity-40" : ""}
                          >
                            {role}{" "}
                            <span className="text-muted-foreground">
                              ({available} of {capacity} open)
                            </span>
                          </SelectItem>
                        );
                      },
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={
                  status === "submitting" ||
                  !form.name ||
                  !form.email ||
                  !form.role
                }
                className="w-full bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d] disabled:opacity-50"
              >
                {status === "submitting"
                  ? "Signing up…"
                  : "Sign Up to Volunteer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
