import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest, getMe } from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setChecking(false);
      return;
    }
    // Validate the stored token is still good; if not, the api interceptor
    // will already have redirected on 401.
    getMe()
      .then((res) => {
        setAdmin(res.admin);
        localStorage.setItem("admin_user", JSON.stringify(res.admin));
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    localStorage.setItem("admin_token", res.token);
    localStorage.setItem("admin_user", JSON.stringify(res.admin));
    setAdmin(res.admin);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, checking, isAuthenticated: Boolean(admin) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
