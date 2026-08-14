import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import { forgotPassword } from "../api/customerApi.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | sent
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await forgotPassword(email);
      setStatus("sent");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-40">
      <Seo title="Forgot Password" />
      <p className="text-center text-xs uppercase tracking-widest2 text-ember">Account Recovery</p>
      <h1 className="mt-3 text-center font-display text-4xl tracking-wide sm:text-5xl">Forgot Password?</h1>

      <div className="glass mt-12 rounded-3xl p-8">
        {status === "sent" ? (
          <p className="text-center text-fog/60">
            If an account exists for <strong className="text-fog">{email}</strong>, a reset link is on its way.
            Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-fog/50">Enter your account email and we'll send you a reset link.</p>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-fog px-6 py-3.5 text-sm font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember disabled:opacity-50"
            >
              {status === "submitting" ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
