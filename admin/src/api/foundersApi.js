import api from "./api.js";

export const listFounders = () => api.get("/founders?all=true").then((r) => r.data);
export const getFounder = (id) => api.get(`/founders/id/${id}`).then((r) => r.data);
export const createFounder = (payload) => api.post("/founders", payload).then((r) => r.data);
export const updateFounder = (id, payload) => api.put(`/founders/${id}`, payload).then((r) => r.data);
export const deleteFounder = (id) => api.delete(`/founders/${id}`).then((r) => r.data);

export const uploadFounderProfileImage = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post(`/founders/${id}/profile-image`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

export const uploadFounderGallery = (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append("images", f));
  return api
    .post(`/founders/${id}/gallery`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

export const deleteFounderGalleryImage = (id, imageId) =>
  api.delete(`/founders/${id}/gallery/${imageId}`).then((r) => r.data);
