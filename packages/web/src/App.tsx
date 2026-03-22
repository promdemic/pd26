import Hero from "@/components/Hero";
import EventInfo from "@/components/EventInfo";
import RSVPForm from "@/components/RSVPForm";
import VolunteerForm from "@/components/VolunteerForm";
import Footer from "@/components/Footer";

function Nav() {
  return (
    <nav
      className="fixed top-0 z-50 w-full backdrop-blur-md"
      style={{ background: "rgba(26,39,68,0.85)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <a href="#home" className="text-lg font-bold tracking-wide text-[#c9a84c]">
          Promdemic 2026
        </a>
        <div className="flex gap-6 text-sm font-medium text-white/80">
          <a href="#about" className="transition-colors hover:text-[#c9a84c]">About</a>
          <a href="#rsvp" className="transition-colors hover:text-[#c9a84c]">RSVP</a>
          <a href="#volunteer" className="transition-colors hover:text-[#c9a84c]">Volunteer</a>
        </div>
      </div>
    </nav>
  );
}

const App = () => {
  return (
    <>
      <Nav />
      <Hero />
      <EventInfo />
      <RSVPForm />
      <VolunteerForm />
      <Footer />
    </>
  );
};

export default App;
