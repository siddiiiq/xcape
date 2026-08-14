import api from "./api.js";

export const listTrips = () => api.get("/trips?all=true").then((r) => r.data);
export const getTrip = (id) => api.get(`/trips/id/${id}`).then((r) => r.data);
export const createTrip = (payload) => api.post("/trips", payload).then((r) => r.data);
export const updateTrip = (id, payload) => api.put(`/trips/${id}`, payload).then((r) => r.data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`).then((r) => r.data);

export const uploadTripCover = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post(`/trips/${id}/cover`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};
