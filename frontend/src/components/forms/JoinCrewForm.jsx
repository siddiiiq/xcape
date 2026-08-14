import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";

// Field config kept in one array so adding/removing a field is a one-line change.
const FIELDS = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "instagramUsername", label: "Instagram Username", type: "text", required: false },
  { name: "city", label: "City", type: "text", required: false },
  { name: "age", label: "Age", type: "number", required: false },
];

const initialState = FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {
  reason: "",
  travelInterests: "",
  password: "",
  confirmPassword: "",
});

// Joining the community now also creates the customer's account in the same
// step — one identity for community membership, bookings, and everything
// else. `redirectTo` lets the booking flow send someone here, then bring
// them right back to the trip they were trying to book.
const JoinCrewForm = ({ redirectTo = "/account" }) => {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error | exists
  const [error, setError] = useState("");
  const { register } = useCustomerAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      await register(form);
      setStatus("success");
      setTimeout(() => navigate(redirectTo), 1200);
    } catch (err) {
      if (err.response?.status === 409) {
        setStatus("exists");
      } else {
        setError(err.response?.data?.message || "Something went wrong. Try again.");
        setStatus("error");
      }
    }
  };

  if (status === "success") {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-3xl p-10 text-center">
        <CheckCircle2 size={48} className="text-ember" />
        <h3 className="font-display text-3xl tracking-wide">Welcome to the Crew</h3>
        <p className="max-w-sm text-fog/60">
          You're in — your account and community membership are both set up. Taking you to your dashboard...
        </p>
      </div>
    );
  }

  if (status === "exists") {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-3xl p-10 text-center">
        <h3 className="font-display text-2xl tracking-wide">You've already got an account</h3>
        <p className="max-w-sm text-fog/60">An account already exists with this email. Sign in to continue.</p>
        <Link
          to="/sign-in"
          state={{ from: redirectTo }}
          className="mt-2 rounded-full bg-fog px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink hover:bg-ember"
        >
          Sign In →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass grid grid-cols-1 gap-5 rounded-3xl p-6 sm:grid-cols-2 sm:p-10">
      {FIELDS.map((field) => (
        <div key={field.name} className={field.name === "fullName" || field.name === "email" ? "sm:col-span-2" : ""}>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">
            {field.label} {field.required && <span className="text-ember">*</span>}
          </label>
          <input
            type={field.type}
            name={field.name}
            required={field.required}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
          />
        </div>
      ))}

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">
          Password <span className="text-ember">*</span>
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">
          Confirm Password <span className="text-ember">*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={6}
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">
          What kind of trips interest you?
        </label>
        <input
          type="text"
          name="travelInterests"
          value={form.travelInterests}
          onChange={handleChange}
          placeholder="Backpacking, road trips, hidden beaches..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">
          Why do you travel?
        </label>
        <textarea
          name="reason"
          rows={3}
          value={form.reason}
          onChange={handleChange}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
        />
      </div>

      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-full bg-fog px-6 py-3.5 text-sm font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember disabled:opacity-50 sm:col-span-2"
      >
        {status === "submitting" ? "Creating your account..." : "Join the Crew →"}
      </button>

      <p className="text-center text-xs text-fog/40 sm:col-span-2">
        Already have an account?{" "}
        <Link to="/sign-in" state={{ from: redirectTo }} className="text-ember hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default JoinCrewForm;
