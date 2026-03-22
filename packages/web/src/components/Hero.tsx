import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{
        background: "linear-gradient(160deg, #1a2744 0%, #2a7f7f 100%)",
      }}
    >
      {/* Subtle wave overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 80%, #c9a84c 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #f5efe6 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a84c]">
          Port Gamble Bay · May 15–16, 2026
        </p>

        <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl">
          Promdemic
          <span className="block text-[#c9a84c]">2026</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-white/80">
          Coastal Elegance on the Bay — an unforgettable overnight dance
          weekend in Port Gamble, WA.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#c9a84c] px-8 text-[#1a2744] hover:bg-[#b8943d]"
          >
            <a href="#rsvp">RSVP Now</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/50 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
          >
            <a href="#volunteer">Volunteer</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 transition-colors hover:text-white"
        aria-label="Scroll to event info"
      >
        <svg
          className="h-6 w-6 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </a>
    </section>
  );
}
