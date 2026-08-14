import api from "./api.js";

export const fetchYouTubeVideos = () => api.get("/youtube").then((res) => res.data);
