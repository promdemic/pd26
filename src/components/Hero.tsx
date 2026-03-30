import { Button } from "@/components/ui/button";
import heroSmWebp from "../assets/hero-sm.webp";
import heroSmJpg from "../assets/hero-sm.jpg";
import heroLgWebp from "../assets/hero-lg.webp";
import heroLgJpg from "../assets/hero-lg.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Responsive photo background */}
      <picture className="absolute inset-0">
        <source
          type="image/webp"
          srcSet={`${heroSmWebp} 800w, ${heroLgWebp} 1920w`}
          sizes="100vw"
        />
        <source
          type="image/jpeg"
          srcSet={`${heroSmJpg} 800w, ${heroLgJpg} 1920w`}
          sizes="100vw"
        />
        <img
          src={heroLgJpg}
          alt="Students at Promdemic"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
      </picture>
      {/* Dark navy overlay for readability */}
      <div className="absolute inset-0 bg-[#1a2744]/75" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a84c]">
          Port Gamble Bay · May 15–16, 2026
        </p>

        <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl">
          Promdemic
          <span className="block text-[#c9a84c]">2026</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-white/80">
          Coastal Elegance on the Bay — an unforgettable overnight dance weekend
          in Port Gamble, WA.
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
};

export default Hero;
