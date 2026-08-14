import api from "./api.js";

export const joinCrew = (payload) => api.post("/members", payload).then((res) => res.data);
