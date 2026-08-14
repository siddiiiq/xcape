import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { NAV_LINKS, BRAND } from "../../constants/config.js";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated, customer, logout } = useCustomerAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass flex w-full max-w-5xl items-center justify-between rounded-full px-5 transition-all duration-500 ${
          scrolled ? "py-2 shadow-lg shadow-black/30" : "py-3"
        }`}
      >
        {/* Brand */}
        <Link
          to="/"
          className="font-display text-lg tracking-wide"
        >
          {BRAND.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm uppercase tracking-widest2 transition-colors ${
                  isActive
                    ? "text-ember"
                    : "text-fog/70 hover:text-fog"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Account / Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/account/bookings"
                className="text-sm uppercase tracking-widest2 text-fog/70 hover:text-fog"
              >
                My Bookings
              </Link>

              <Link
                to="/account"
                className="flex items-center gap-1.5 rounded-full bg-fog px-4 py-2 text-xs font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember"
              >
                <User size={13} />
                {customer?.name?.split(" ")[0] || "My Account"}
              </Link>

              <button
                onClick={logout}
                className="text-fog/50 hover:text-red-400"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-sm uppercase tracking-widest2 text-fog/70 hover:text-fog"
              >
                Sign In
              </Link>

              <Link
                to="/join"
                className="rounded-full bg-fog px-5 py-2 text-xs font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember"
              >
                Join Community →
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-fog md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="glass absolute left-4 right-4 top-20 z-40 flex flex-col gap-1 rounded-3xl p-4 md:hidden">
          
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm uppercase tracking-widest2 text-fog/80 hover:bg-white/5"
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm uppercase tracking-widest2 text-fog/80 hover:bg-white/5"
              >
                My Account
              </Link>

              <Link
                to="/account/bookings"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm uppercase tracking-widest2 text-fog/80 hover:bg-white/5"
              >
                My Bookings
              </Link>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm uppercase tracking-widest2 text-red-400"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm uppercase tracking-widest2 text-fog/80 hover:bg-white/5"
              >
                Sign In
              </Link>

              <Link
                to="/join"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-fog px-4 py-3 text-center text-sm font-semibold uppercase tracking-widest2 text-ink"
              >
                Join Community →
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;