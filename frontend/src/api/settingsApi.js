import api from "./api.js";

export const fetchSettings = () => api.get("/settings").then((res) => res.data);
