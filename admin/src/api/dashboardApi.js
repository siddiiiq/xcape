import api from "./api.js";

export const getStats = () => api.get("/dashboard/stats").then((r) => r.data);
