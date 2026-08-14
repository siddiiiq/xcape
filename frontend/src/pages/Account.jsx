import React from "react";
import { Link } from "react-router-dom";
import { User, Calendar, LogOut } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";

const Account = () => {
  const { customer, logout } = useCustomerAuth();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40">
      <Seo title="My Account" />
      <p className="text-xs uppercase tracking-widest2 text-ember">My Account</p>
      <h1 className="mt-3 font-display text-5xl tracking-wide sm:text-6xl">Welcome, {customer?.name?.split(" ")[0]}</h1>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/account/profile" className="hover-pop glass flex flex-col items-start gap-3 rounded-2xl p-6">
          <User size={20} className="text-ember" />
          <p className="font-display text-xl tracking-wide">My Profile</p>
          <p className="text-sm text-fog/50">Update your name and phone number.</p>
        </Link>
        <Link to="/account/bookings" className="hover-pop glass flex flex-col items-start gap-3 rounded-2xl p-6">
          <Calendar size={20} className="text-ember" />
          <p className="font-display text-xl tracking-wide">My Bookings</p>
          <p className="text-sm text-fog/50">Track every trip you've booked.</p>
        </Link>
        <button
          onClick={logout}
          className="hover-pop glass flex flex-col items-start gap-3 rounded-2xl p-6 text-left"
        >
          <LogOut size={20} className="text-ember" />
          <p className="font-display text-xl tracking-wide">Logout</p>
          <p className="text-sm text-fog/50">Sign out of your account.</p>
        </button>
      </div>
    </div>
  );
};

export default Account;
