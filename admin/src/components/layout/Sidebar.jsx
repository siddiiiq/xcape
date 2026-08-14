import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  Images,
  Clapperboard,
  Youtube,
  Users,
  UserRound,
  Settings,
  LogOut,
  Plane,
  Ticket,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/places", label: "Places", icon: MapPin },
  { to: "/admin/trips", label: "Trips", icon: Plane },
  { to: "/admin/bookings", label: "Bookings", icon: Ticket },
  { to: "/admin/customers", label: "Customers", icon: UserCircle },
  { to: "/admin/stories", label: "Stories", icon: BookOpen },
  { to: "/admin/media", label: "Media", icon: Images },
  { to: "/admin/reels", label: "Reels", icon: Clapperboard },
  { to: "/admin/youtube", label: "YouTube", icon: Youtube },
  { to: "/admin/founders", label: "Founders", icon: UserRound },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const Sidebar = () => {
  const { admin, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-panel p-5 md:flex">
      <div className="mb-8">
        <p className="text-lg font-semibold">Crew Admin</p>
        <p className="text-xs text-muted">Xcape.FOMO</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-zinc-100"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-line pt-4">
        <p className="truncate text-xs text-muted">{admin?.email}</p>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
