import Booking from "../models/Booking.js";

const randomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// Human-friendly, unique booking reference like "TRP-4F8K2A" — retries on the
// astronomically unlikely collision rather than relying on a counter collection.
export const generateBookingReference = async () => {
  let reference = `TRP-${randomCode()}`;
  while (await Booking.exists({ bookingReference: reference })) {
    reference = `TRP-${randomCode()}`;
  }
  return reference;
};

export default generateBookingReference;
