import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTimeline } from "@/hooks/useTimeline";
import TimelineEditor from "@/components/TimelineEditor";
import { useRef } from "react";

const SKELETON_WIDTHS = ["w-48", "w-56", "w-40", "w-52", "w-44", "w-48", "w-36", "w-52", "w-44", "w-40", "w-48"];

const TimelineSkeleton = () => (
  <ol className="space-y-3">
    {SKELETON_WIDTHS.map((w, i) => (
      <li key={i} className="flex gap-4">
        <span className="w-20 shrink-0 rounded bg-[#c9a84c]/20 animate-pulse h-4" />
        <span className={`${w} rounded bg-[#1a2744]/10 animate-pulse h-4`} />
      </li>
    ))}
  </ol>
);

const EventInfo = () => {
  const editingRef = useRef(false);
  const { state: timelineState, saveTimeline, flushPending } = useTimeline(editingRef);
  const { state: authState } = useAuth();

  const isAdmin = authState.status === "authenticated" && authState.isAdmin;

  const handleSave = async (entries: Parameters<typeof saveTimeline>[0]) => {
    if (authState.status !== "authenticated") return;
    await saveTimeline(entries, authState.user.uid);
  };

  const handleEditingChange = (editing: boolean) => {
    editingRef.current = editing;
    if (!editing) flushPending();
  };

  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#1a2744] sm:text-4xl">
          Event Details
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Timeline */}
          <Card className="border-[#d4c8b8]">
            <CardHeader>
              <CardTitle className="text-[#1a2744]">Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineState.status === "loading" && <TimelineSkeleton />}
              {timelineState.status === "error" && (
                <p className="text-sm text-[#1a2744]/60">Schedule unavailable — check back soon.</p>
              )}
              {timelineState.status === "success" && (
                <TimelineEditor
                  entries={timelineState.entries}
                  isAdmin={isAdmin}
                  onSave={handleSave}
                  onEditingChange={handleEditingChange}
                />
              )}
            </CardContent>
          </Card>

          {/* Logistics */}
          <div className="space-y-6">
            <Card className="border-[#d4c8b8]">
              <CardHeader>
                <CardTitle className="text-[#1a2744]">Getting There</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#1a2744]">
                <p>
                  <span className="font-semibold">Ferry:</span> Foot passengers
                  only. Meet at Edmonds Terminal by 4:30 PM for the 5:25 PM
                  sailing.
                </p>
                <p>
                  <span className="font-semibold">Shuttle:</span> Drivers will
                  be waiting at the Kingston passenger off-ramp at 5:45 PM.
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  <a
                    href="https://maps.google.com/?q=30119+Gamble+Pl+NE+Kingston+WA+98346"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2a7f7f] underline underline-offset-2"
                  >
                    30119 Gamble Pl NE, Kingston, WA 98346
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#d4c8b8]">
              <CardHeader>
                <CardTitle className="text-[#1a2744]">Food & Fun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#1a2744]">
                <p className="font-semibold text-[#2a7f7f]">Dinner</p>
                <p>TBA - but expect something delicious!</p>
                <p className="mt-2 font-semibold text-[#2a7f7f]">Dessert</p>
                <p>TBA - Promdemic cupcakes? · beachside s'mores station?</p>
                <p className="mt-2 font-semibold text-[#2a7f7f]">Morning</p>
                <p>Pancakes & fruit breakfast for overnight guests</p>
              </CardContent>
            </Card>

            <Card className="border-[#d4c8b8]">
              <CardHeader>
                <CardTitle className="text-[#1a2744]">Overnight</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[#1a2744]">
                <p>
                  Overnight guests are welcome! Bring a sleeping bag, pillow,
                  and overnight bag. Gear will be stored in the designated room
                  on arrival.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
