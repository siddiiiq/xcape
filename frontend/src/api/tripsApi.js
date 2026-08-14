import api from "./api.js";

export const fetchTrips = () => api.get("/trips").then((r) => r.data);
export const fetchCampaignTrips = () => api.get("/trips/campaign").then((r) => r.data);
export const fetchTripBySlug = (slug) => api.get(`/trips/${slug}`).then((r) => r.data);
