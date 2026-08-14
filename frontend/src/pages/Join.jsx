import React from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/common/Seo.jsx";
import JoinCrewForm from "../components/forms/JoinCrewForm.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

const Join = () => {
  const settings = useSettings();
  const location = useLocation();
  // If someone was redirected here from a gated action (e.g. booking a
  // trip while signed out), send them right back after they join.
  const redirectTo = location.state?.from || "/account";

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-40">
      <Seo title="Join the Crew" description="Don't just follow the journey. Join it." />
      <p className="text-center text-xs uppercase tracking-widest2 text-ember">The Community</p>
      <h1 className="mt-3 text-center font-display text-5xl tracking-wide sm:text-6xl">
        {settings?.joinCrewText || "Join The Crew"}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-fog/50">
        Tell us a little about yourself — we read every application. Joining creates your account too, so
        you can book trips and track them afterward.
      </p>

      <div className="mt-14">
        <JoinCrewForm redirectTo={redirectTo} />
      </div>
    </div>
  );
};

export default Join;
