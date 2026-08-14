import api from "./api.js";

export const listPlaces = () => api.get("/places?all=true").then((r) => r.data);
export const getPlace = (id) => api.get(`/places/id/${id}`).then((r) => r.data);
export const createPlace = (payload) => api.post("/places", payload).then((r) => r.data);
export const updatePlace = (id, payload) => api.put(`/places/${id}`, payload).then((r) => r.data);
export const deletePlace = (id) => api.delete(`/places/${id}`).then((r) => r.data);

export const uploadPlaceCover = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post(`/places/${id}/cover`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

export const uploadPlaceGallery = (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append("images", f));
  return api
    .post(`/places/${id}/images`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

export const updatePlaceImage = (id, imageId, payload) =>
  api.put(`/places/${id}/images/${imageId}`, payload).then((r) => r.data);

export const reorderPlaceImages = (id, order) =>
  api.put(`/places/${id}/images/reorder`, { order }).then((r) => r.data);

export const deletePlaceImage = (id, imageId) =>
  api.delete(`/places/${id}/images/${imageId}`).then((r) => r.data);
