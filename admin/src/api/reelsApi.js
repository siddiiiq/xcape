import api from "./api.js";

export const listReels = () => api.get("/reels?all=true").then((r) => r.data);
export const getReel = (id) => api.get(`/reels/id/${id}`).then((r) => r.data);
export const createReel = (payload) => api.post("/reels", payload).then((r) => r.data);
export const updateReel = (id, payload) => api.put(`/reels/${id}`, payload).then((r) => r.data);
export const deleteReel = (id) => api.delete(`/reels/${id}`).then((r) => r.data);

export const uploadReelThumbnail = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post(`/reels/${id}/thumbnail`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

export const uploadReelVideoPreview = (id, file) => {
  const formData = new FormData();
  formData.append("video", file);
  return api
    .post(`/reels/${id}/video-preview`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};
