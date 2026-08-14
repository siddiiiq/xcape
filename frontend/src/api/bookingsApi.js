import api from "./api.js";

export const createBooking = (payload) => api.post("/bookings", payload).then((r) => r.data);
export const verifyBookingPayment = (bookingId, payload) =>
  api.post(`/bookings/${bookingId}/verify`, payload).then((r) => r.data);
export const fetchMyBookings = () => api.get("/bookings/mine").then((r) => r.data);
export const fetchMyBookingById = (id) => api.get(`/bookings/mine/${id}`).then((r) => r.data);
