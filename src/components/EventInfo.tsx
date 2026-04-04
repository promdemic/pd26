import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTimeline } from "@/hooks/useTimeline";
import InfoSectionEditor from "@/components/InfoSectionEditor";
import TimelineEditor from "@/components/TimelineEditor";
import { type InfoItem, type TimelineEntry } from "@/lib/schemas";
import { useRef } from "react";

const SKELETON_WIDTHS = [
  "w-48",
  "w-56",
  "w-40",
  "w-52",
  "w-44",
  "w-48",
  "w-36",
  "w-52",
  "w-44",
  "w-40",
  "w-48",
];

const TimelineSkeleton = () => (
  <ol className="space-y-3">
    {SKELETON_WIDTHS.map((w, i) => (
      <li key={i} className="flex gap-4">
        <span className="w-20 shrink-0 rounded bg-gold/20 animate-pulse h-4" />
        <span className={`${w} rounded bg-navy/10 animate-pulse h-4`} />
      </li>
    ))}
  </ol>
);

const DEFAULT_TIMELINE: TimelineEntry[] = [
  { id: "1", time: "4:20 PM", label: "Meet at Edmonds Ferry Terminal" },
  { id: "2", time: "4:45 PM", label: "Ferry Departure (foot passengers)" },
  { id: "3", time: "5:15 PM", label: "Arrive Kingston — shuttle pickup" },
  { id: "4", time: "6:15 PM", label: "Mocktail Hour & Photos" },
  { id: "5", time: "7:15 PM", label: "Sunset Dinner" },
  { id: "6", time: "8:30 PM", label: "Dancing & DJ" },
  { id: "7", time: "10:30 PM", label: "Fire Pit & S'mores" },
  {
    id: "8",
    time: "11:00 PM",
    label: "Overnight transition / optional pickup",
  },
  { id: "9", time: "9:00 AM", label: "Farewell Pancake Breakfast" },
  {
    id: "10",
    time: "10:30 AM",
    label: "Morning shuttles to Kingston Terminal",
  },
  { id: "11", time: "11:10 AM", label: "Return ferry to Edmonds" },
];

const DEFAULT_GETTING_THERE: InfoItem[] = [
  {
    label: "Ferry",
    body: "Foot passengers only. Meet at Edmonds Terminal by 4:30 PM for the 5:25 PM sailing.",
  },
  {
    label: "Shuttle",
    body: "Drivers will be waiting at the Kingston passenger off-ramp at 5:45 PM.",
  },
  {
    label: "Address",
    body: "30119 Gamble Pl NE, Kingston, WA 98346",
    href: "https://maps.google.com/?q=30119+Gamble+Pl+NE+Kingston+WA+98346",
  },
];

const DEFAULT_FOOD: InfoItem[] = [
  { label: "Dinner", body: "TBA - but expect something delicious!" },
  {
    label: "Dessert",
    body: "TBA - Promdemic cupcakes? · beachside s'mores station?",
  },
  { label: "Morning", body: "Pancakes & fruit breakfast for overnight guests" },
];

const DEFAULT_OVERNIGHT: InfoItem[] = [
  {
    label: "",
    body: "Overnight guests are welcome! Bring a sleeping bag, pillow, and overnight bag. Gear will be stored in the designated room on arrival.",
  },
];

const DEFAULT_DISNEYBOUNDING: InfoItem[] = [
  {
    label: "What is Disneybounding?",
    body: "An optional theme — dress in the colors and style of your favorite Disney character using everyday clothes. Totally optional, always fun.",
  },
  {
    label: "No Costumes",
    body: "Outfits should not look like costumes. Think inspired-by, not dressed-as.",
  },
  {
    label: "Focus on Colors",
    body: "Pick a character and use their signature colors. Minnie Mouse? Red top with white polka dots, black bottoms, yellow shoes.",
  },
  {
    label: "Everyday Clothes",
    body: "Normal street clothes only — skirts, t-shirts, vests, dresses. Keep it wearable.",
  },
  {
    label: "No Masks or Weapons",
    body: "Be cool, don't make it weird.",
  },
];

const EventInfo = () => {
  const editingRef = useRef(false);
  const {
    state: timelineState,
    saveTimeline,
    saveSection,
    flushPending,
  } = useTimeline(editingRef);
  const { state: authState } = useAuth();

  const isAdmin = authState.status === "authenticated" && authState.isAdmin;

  const handleEditingChange = (editing: boolean) => {
    editingRef.current = editing;
    if (!editing) flushPending();
  };

  const handleSaveTimeline = async (
    entries: Parameters<typeof saveTimeline>[0],
  ) => {
    if (authState.status !== "authenticated") return;
    await saveTimeline(entries, authState.user.uid);
  };

  const handleSaveSection =
    (field: "gettingThere" | "food" | "overnight" | "disneybounding") =>
    async (items: InfoItem[]) => {
      if (authState.status !== "authenticated") return;
      await saveSection(field, items, authState.user.uid);
    };

  const sections = timelineState.status === "success" ? timelineState : null;

  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-navy sm:text-4xl">
          Event Details
        </h2>

        <div className="md:columns-2 md:gap-8">
          <Card className="mb-8 break-inside-avoid border-border">
            <CardHeader>
              <CardTitle className="text-navy">Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineState.status === "loading" && <TimelineSkeleton />}
              {timelineState.status === "error" && (
                <p className="text-sm text-navy/60">
                  Schedule unavailable — check back soon.
                </p>
              )}
              {timelineState.status === "success" && (
                <TimelineEditor
                  entries={
                    timelineState.entries.length > 0
                      ? timelineState.entries
                      : DEFAULT_TIMELINE
                  }
                  isAdmin={isAdmin}
                  onSave={handleSaveTimeline}
                  onEditingChange={handleEditingChange}
                />
              )}
            </CardContent>
          </Card>

          <Card className="mb-8 break-inside-avoid border-border">
            <CardHeader>
              <CardTitle className="text-navy">Getting There</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-navy">
              <InfoSectionEditor
                items={sections?.gettingThere ?? DEFAULT_GETTING_THERE}
                isAdmin={isAdmin}
                labelStyle="heading"
                onSave={handleSaveSection("gettingThere")}
                onEditingChange={handleEditingChange}
              />
            </CardContent>
          </Card>

          <Card className="mb-8 break-inside-avoid border-border">
            <CardHeader>
              <CardTitle className="text-navy">Food & Fun</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-navy">
              <InfoSectionEditor
                items={sections?.food ?? DEFAULT_FOOD}
                isAdmin={isAdmin}
                labelStyle="heading"
                onSave={handleSaveSection("food")}
                onEditingChange={handleEditingChange}
              />
            </CardContent>
          </Card>

          <Card className="mb-8 break-inside-avoid border-border">
            <CardHeader>
              <CardTitle className="text-navy">Disneybounding ✨</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-navy">
              <InfoSectionEditor
                items={sections?.disneybounding ?? DEFAULT_DISNEYBOUNDING}
                isAdmin={isAdmin}
                labelStyle="heading"
                onSave={handleSaveSection("disneybounding")}
                onEditingChange={handleEditingChange}
              />
            </CardContent>
          </Card>

          <Card className="mb-8 break-inside-avoid border-border">
            <CardHeader>
              <CardTitle className="text-navy">Overnight</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-navy">
              <InfoSectionEditor
                items={sections?.overnight ?? DEFAULT_OVERNIGHT}
                isAdmin={isAdmin}
                labelStyle="heading"
                onSave={handleSaveSection("overnight")}
                onEditingChange={handleEditingChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
