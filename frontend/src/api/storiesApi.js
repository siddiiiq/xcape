import api from "./api.js";

export const fetchStories = () => api.get("/stories").then((res) => res.data);
export const fetchStoryBySlug = (slug) => api.get(`/stories/${slug}`).then((res) => res.data);
