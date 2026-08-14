import React from "react";
import { Link } from "react-router-dom";
import { MapPin, BookOpen, Images, Clapperboard, Youtube, UserRound, Users, UserPlus, Plane, Ticket, UserCircle, IndianRupee } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { getStats } from "../api/dashboardApi.js";

const STAT_CARDS = [
  { key: "totalTrips", label: "Total Trips", icon: Plane, to: "/admin/trips" },
  { key: "totalBookings", label: "Total Bookings", icon: Ticket, to: "/admin/bookings" },
  { key: "totalCustomers", label: "Total Customers", icon: UserCircle, to: "/admin/customers" },
  { key: "totalRevenue", label: "Revenue (Paid)", icon: IndianRupee, to: "/admin/bookings", prefix: "₹" },
  { key: "totalPlaces", label: "Total Places", icon: MapPin, to: "/admin/places" },
  { key: "totalStories", label: "Total Stories", icon: BookOpen, to: "/admin/stories" },
  { key: "totalImages", label: "Total Images", icon: Images, to: "/admin/media" },
  { key: "totalReels", label: "Total Reels", icon: Clapperboard, to: "/admin/reels" },
  { key: "totalYouTube", label: "Total YouTube", icon: Youtube, to: "/admin/youtube" },
  { key: "totalFounders", label: "Total Founders", icon: UserRound, to: "/admin/founders" },
  { key: "totalMembers", label: "Total Members", icon: Users, to: "/admin/members" },
  { key: "newMembers", label: "New Members", icon: UserPlus, to: "/admin/members" },
];

const Dashboard = () => {
  const { data, loading, error, refetch } = useFetch(getStats, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const { stats, recent } = data || {};

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of the whole platform." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, to, prefix }) => (
          <Link key={key} to={to} className="card p-5 transition hover:border-ink">
            <Icon size={18} className="text-accent" />
            <p className="mt-3 text-2xl font-semibold">{prefix}{stats?.[key] ?? 0}</p>
            <p className="text-xs text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold">Recent Bookings</p>
          <div className="space-y-3">
            {recent?.bookings?.length ? (
              recent.bookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{b.trip?.title || "Trip deleted"}</p>
                    <p className="text-xs text-muted">{b.bookingReference}</p>
                  </div>
                  <span className="text-xs capitalize text-muted">{b.paymentStatus}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No bookings yet.</p>
            )}
          </div>
        </div>
        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold">Recent Members</p>
          <div className="space-y-3">
            {recent?.members?.length ? (
              recent.members.map((m) => (
                <div key={m._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{m.fullName}</p>
                    <p className="text-xs text-muted">{m.city || m.email}</p>
                  </div>
                  <span className="text-xs capitalize text-muted">{m.status}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No members yet.</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold">Recent Places</p>
          <div className="space-y-3">
            {recent?.places?.length ? (
              recent.places.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <p className="font-medium">{p.title}</p>
                  <span className="text-xs text-muted">{p.published ? "Published" : "Draft"}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No places yet.</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold">Recent Reels</p>
          <div className="space-y-3">
            {recent?.reels?.length ? (
              recent.reels.map((r) => (
                <div key={r._id} className="text-sm">
                  <p className="font-medium">{r.title}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No reels yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
