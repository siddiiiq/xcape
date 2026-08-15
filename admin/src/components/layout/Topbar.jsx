import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/places", label: "Places" },
  { to: "/admin/trips", label: "Trips" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/stories", label: "Stories" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/reels", label: "Reels" },
  { to: "/admin/youtube", label: "YouTube" },
  { to: "/admin/founders", label: "Founders" },
  { to: "/admin/members", label: "Members" },
  { to: "/admin/settings", label: "Settings" },
];

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-panel md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-semibold">Crew Admin</p>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="-mr-1.5 rounded-lg p-1.5 active:bg-zinc-100"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <>
          {/* Tap-outside-to-close backdrop, sits below the header/menu but
              above page content. */}
          <div className="fixed inset-0 top-[53px] z-20 bg-black/20" onClick={() => setOpen(false)} />

          <div className="absolute left-0 right-0 top-full z-30 flex max-h-[calc(100vh-53px)] flex-col gap-1 overflow-y-auto border-b border-line bg-panel p-3 shadow-lg">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-zinc-100"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600">
              <LogOut size={16} /> Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Topbar;
