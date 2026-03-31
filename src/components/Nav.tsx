const Nav = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-navy/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <a href="#home" className="text-lg font-bold tracking-wide text-gold">
          Promdemic 2026
        </a>
        <div className="flex gap-6 text-sm font-medium text-white/80">
          <a href="#about" className="transition-colors hover:text-gold">
            About
          </a>
          <a href="#rsvp" className="transition-colors hover:text-gold">
            RSVP
          </a>
          <a href="#volunteer" className="transition-colors hover:text-gold">
            Volunteer
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
