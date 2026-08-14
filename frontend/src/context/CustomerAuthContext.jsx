import React, { createContext, useContext, useEffect, useState } from "react";
import {
  registerCustomer as registerRequest,
  loginCustomer as loginRequest,
  getMyProfile,
} from "../api/customerApi.js";

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customer_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setChecking(false);
      return;
    }
    getMyProfile()
      .then((res) => {
        setCustomer(res.customer);
        localStorage.setItem("customer_user", JSON.stringify(res.customer));
      })
      .catch(() => {
        // Token invalid/expired — clear the stale session quietly.
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer_user");
        setCustomer(null);
      })
      .finally(() => setChecking(false));
  }, []);

  const persistSession = (res) => {
    localStorage.setItem("customer_token", res.token);
    localStorage.setItem("customer_user", JSON.stringify(res.customer));
    setCustomer(res.customer);
  };

  const register = async (payload) => {
    const res = await registerRequest(payload);
    persistSession(res);
    return res;
  };

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    persistSession(res);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{ customer, register, login, logout, checking, isAuthenticated: Boolean(customer) }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);

export default CustomerAuthContext;
