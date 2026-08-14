import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";

// Gates account/booking pages behind sign-in. Preserves the page the
// customer was trying to reach (e.g. a specific trip's booking flow) via
// router state, so SignIn/Join can send them right back after auth —
// this is what makes the "click Book Now while logged out" flow work
// without losing their place.
const ProtectedCustomerRoute = ({ children }) => {
  const { isAuthenticated, checking } = useCustomerAuth();
  const location = useLocation();

  if (checking) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-fog/40">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedCustomerRoute;
