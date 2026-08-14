import api from "./api.js";

export const fetchPlaces = () => api.get("/places").then((res) => res.data);
export const fetchPlaceBySlug = (slug) => api.get(`/places/${slug}`).then((res) => res.data);
