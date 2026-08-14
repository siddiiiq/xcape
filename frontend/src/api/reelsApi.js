import api from "./api.js";

export const fetchReels = () => api.get("/reels").then((res) => res.data);
