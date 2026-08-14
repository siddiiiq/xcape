import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return <div className="flex h-screen items-center justify-center text-sm text-muted">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
