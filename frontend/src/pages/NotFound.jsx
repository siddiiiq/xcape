import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <Seo title="Lost" />
    <p className="text-xs uppercase tracking-widest2 text-ember">404</p>
    <h1 className="mt-3 font-display text-6xl tracking-wide sm:text-8xl">Well, you're really lost now.</h1>
    <p className="mt-4 text-fog/50">This page doesn't exist — but plenty of real places do.</p>
    <Link to="/" className="mt-8 rounded-full bg-fog px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink hover:bg-ember">
      Take Me Home
    </Link>
  </div>
);

export default NotFound;
