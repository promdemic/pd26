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
import { Textarea } from "@/components/ui/textarea";

interface FormState {
  name: string;
  dietary: string;
  songs: string;
  overnight: string;
}

const RSVPForm = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    dietary: "",
    songs: "",
    overnight: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // Phase 2: wire to Firestore
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <section id="rsvp" className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-[#1a2744]">
            You're on the list!
          </h2>
          <p className="text-[#5a6a8a]">
            We've got your RSVP, {form.name}. See you on the Bay!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="bg-[#1a2744] px-6 py-20">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
          Student RSVP
        </h2>
        <p className="mb-8 text-center text-white/70">
          Secure your spot for Promdemic 2026
        </p>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Your Info</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Label htmlFor="dietary" className="text-white/90">
                  Dietary Needs
                </Label>
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
                <Label htmlFor="songs" className="text-white/90">
                  Song Requests
                </Label>
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
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, overnight: v }))
                  }
                  required
                >
                  <SelectTrigger className="border-white/20 bg-white/10 text-white">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes — staying overnight</SelectItem>
                    <SelectItem value="no">
                      No — picking up at 11 PM
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting" || !form.name || !form.overnight}
                className="w-full bg-[#c9a84c] text-[#1a2744] hover:bg-[#b8943d] disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting…" : "Submit RSVP"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RSVPForm;
