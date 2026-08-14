import api from "./api.js";

export const listBookings = (params = {}) => api.get("/bookings", { params }).then((r) => r.data);
export const updateBookingStatus = (id, payload) => api.put(`/bookings/${id}`, payload).then((r) => r.data);
