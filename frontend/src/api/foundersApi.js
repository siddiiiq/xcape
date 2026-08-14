import api from "./api.js";

export const fetchFounders = () => api.get("/founders").then((res) => res.data);
export const fetchFounderBySlug = (slug) => api.get(`/founders/${slug}`).then((res) => res.data);
