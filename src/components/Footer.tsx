import AdminSignInModal from "@/components/AdminSignInModal";
import { useState } from "react";

const Footer = () => {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <footer className="bg-navy px-6 py-10 text-center text-sm text-sand/60">
      <p className="mb-1 font-semibold text-gold">Promdemic 2026</p>
      <p>May 15–16, 2026 · 30119 Gamble Pl NE, Kingston, WA 98346</p>
      <p className="mt-3 italic">See you on the Bay.</p>
      <button
        onClick={() => setAdminOpen(true)}
        className="mt-6 text-xs opacity-30 transition-opacity hover:opacity-60"
      >
        Admin
      </button>
      <AdminSignInModal open={adminOpen} onOpenChange={setAdminOpen} />
    </footer>
  );
};

export default Footer;
