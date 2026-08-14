import api from "./api.js";

export const listYouTubeVideos = () => api.get("/youtube?all=true").then((r) => r.data);
export const getYouTubeVideo = (id) => api.get(`/youtube/id/${id}`).then((r) => r.data);
export const createYouTubeVideo = (payload) => api.post("/youtube", payload).then((r) => r.data);
export const updateYouTubeVideo = (id, payload) => api.put(`/youtube/${id}`, payload).then((r) => r.data);
export const deleteYouTubeVideo = (id) => api.delete(`/youtube/${id}`).then((r) => r.data);

export const uploadYouTubeThumbnail = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post(`/youtube/${id}/thumbnail`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};
