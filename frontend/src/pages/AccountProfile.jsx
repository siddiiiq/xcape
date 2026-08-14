import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import { updateMyProfile } from "../api/customerApi.js";

const AccountProfile = () => {
  const { customer } = useCustomerAuth();
  const [form, setForm] = useState({ name: customer?.name || "", phone: customer?.phone || "" });
  const [status, setStatus] = useState("idle"); // idle | saving | saved
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await updateMyProfile(form);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
      setStatus("idle");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 pb-24 pt-40">
      <Seo title="My Profile" />
      <Link to="/account" className="mb-6 inline-flex items-center gap-1.5 text-xs text-fog/60 hover:text-fog">
        <ArrowLeft size={14} /> My Account
      </Link>
      <p className="text-xs uppercase tracking-widest2 text-ember">My Account</p>
      <h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">My Profile</h1>

      <form onSubmit={handleSubmit} className="glass mt-10 space-y-5 rounded-3xl p-8">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Name</label>
          <input
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Phone</label>
          <input
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Email</label>
          <input
            disabled
            value={customer?.email}
            className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-fog/40 outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-fog px-6 py-3 text-sm font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember disabled:opacity-50"
        >
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AccountProfile;
