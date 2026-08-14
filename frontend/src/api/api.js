import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// Public site now has an authenticated customer layer (booking, account),
// so every request quietly attaches the customer token when one exists.
// Public GET requests ignore the header server-side; protected ones need it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("customer_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
