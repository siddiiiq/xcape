import api from "./api.js";

export const registerCustomer = (payload) => api.post("/customers/register", payload).then((r) => r.data);
export const loginCustomer = (email, password) => api.post("/customers/login", { email, password }).then((r) => r.data);
export const getMyProfile = () => api.get("/customers/me").then((r) => r.data);
export const updateMyProfile = (payload) => api.put("/customers/me", payload).then((r) => r.data);
export const forgotPassword = (email) => api.post("/customers/forgot-password", { email }).then((r) => r.data);
export const resetPassword = (token, password, confirmPassword) =>
  api.post(`/customers/reset-password/${token}`, { password, confirmPassword }).then((r) => r.data);
