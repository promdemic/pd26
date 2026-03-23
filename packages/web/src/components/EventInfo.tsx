import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TIMELINE = [
  { time: "4:30 PM", event: "Meet at Edmonds Ferry Terminal" },
  { time: "5:25 PM", event: "Ferry Departure (foot passengers)" },
  { time: "5:50 PM", event: "Arrive Kingston — shuttle pickup" },
  { time: "6:15 PM", event: "Mocktail Hour & Photos" },
  { time: "7:15 PM", event: "Sunset Buffet Dinner" },
  { time: "8:30 PM", event: "Dancing & DJ" },
  { time: "10:30 PM", event: "Fire Pit & S'mores Wind-Down" },
  { time: "11:00 PM", event: "Overnight transition / optional pickup" },
  { time: "9:00 AM", event: "Farewell Pancake Breakfast" },
  { time: "10:30 AM", event: "Morning shuttles to Kingston Terminal" },
  { time: "11:10 AM", event: "Return ferry to Edmonds" },
];

const EventInfo = () => {
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
              <ol className="space-y-3">
                {TIMELINE.map(({ time, event }) => (
                  <li key={time} className="flex gap-4">
                    <span className="w-20 shrink-0 text-right text-sm font-semibold text-[#c9a84c]">
                      {time}
                    </span>
                    <span className="text-sm text-[#1a2744]">{event}</span>
                  </li>
                ))}
              </ol>
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
                <p className="font-semibold text-[#2a7f7f]">Dinner Buffet</p>
                <p>
                  Grilled salmon · herb roasted chicken · vegetarian pasta ·
                  summer corn salad · roasted potatoes · Kingston sourdough
                </p>
                <p className="mt-2 font-semibold text-[#2a7f7f]">Dessert</p>
                <p>Promdemic cupcakes · beachside s'mores station</p>
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
