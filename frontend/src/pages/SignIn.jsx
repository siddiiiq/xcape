import React, { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";

const SignIn = () => {
  const { login, isAuthenticated } = useCustomerAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/account";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-40">
      <Seo title="Sign In" description="Sign in to your Xcape.FOMO account." />
      <p className="text-center text-xs uppercase tracking-widest2 text-ember">Welcome Back</p>
      <h1 className="mt-3 text-center font-display text-5xl tracking-wide">Sign In</h1>

      <form onSubmit={handleSubmit} className="glass mt-12 space-y-5 rounded-3xl p-8">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-fog/50">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-ember"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-fog px-6 py-3.5 text-sm font-semibold uppercase tracking-widest2 text-ink transition hover:bg-ember disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex items-center justify-between text-xs text-fog/40">
          <Link to="/forgot-password" className="hover:text-ember">
            Forgot Password?
          </Link>
          <span>
            Don't have an account?{" "}
            <Link to="/join" state={{ from: redirectTo }} className="text-ember hover:underline">
              Join Community
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
