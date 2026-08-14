import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import { resetPassword } from "../api/customerApi.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      await resetPassword(token, form.password, form.confirmPassword);
      setStatus("done");
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired.");
      setStatus("idle");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-40">
      <Seo title="Reset Password" />
      <p className="text-center text-xs uppercase tracking-widest2 text-ember">Account Recovery</p>
      <h1 className="mt-3 text-center font-display text-4xl tracking-wide sm:text-5xl">Set a New Password</h1>

      <div className="glass mt-12 rounded-3xl p-8">
        {status === "done" ? (
          <p className="text-center text-fog/60">Password updated. Taking you to sign in...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Confirm Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-fog px-6 py-3.5 text-sm font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember disabled:opacity-50"
            >
              {status === "submitting" ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-xs text-fog/40">
          <Link to="/sign-in" className="text-ember hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
