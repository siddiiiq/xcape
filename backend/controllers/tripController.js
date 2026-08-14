import Trip from "../models/Trip.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toSlug } from "../utils/slugify.js";
import { uploadBuffer, deleteAsset } from "../utils/cloudinaryHelpers.js";

const ensureUniqueSlug = async (base, excludeId = null) => {
  let slug = toSlug(base);
  let attempt = 0;
  while (
    await Trip.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
  ) {
    attempt += 1;
    slug = `${toSlug(base)}-${attempt + 1}`;
  }
  return slug;
};

// @route  GET /api/trips
// @access Public (published only) / Private (all, with ?all=true)
export const getTrips = asyncHandler(async (req, res) => {
  const isAdminRequest = Boolean(req.admin);
  const filter = isAdminRequest && req.query.all ? {} : { published: true };
  const trips = await Trip.find(filter).sort({ order: 1, startDate: 1 });
  res.json({ success: true, count: trips.length, trips });
});

// @route  GET /api/trips/campaign
// @access Public
// The one (or more) actively promoted trip(s) surfaced on the homepage.
export const getCampaignTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({
    published: true,
    isCampaign: true,
    endDate: { $gte: new Date() },
  }).sort({ order: 1, startDate: 1 });
  res.json({ success: true, count: trips.length, trips });
});

// @route  GET /api/trips/:slug
// @access Public
export const getTripBySlug = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ slug: req.params.slug });
  if (!trip || (!trip.published && !req.admin)) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.json({ success: true, trip });
});

// @route  GET /api/trips/id/:id
// @access Private
export const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.json({ success: true, trip });
});

// @route  POST /api/trips
// @access Private
export const createTrip = asyncHandler(async (req, res) => {
  const { title, destination, startDate, endDate, price, capacity } = req.body;
  if (!title || !destination || !startDate || !endDate || price === undefined || !capacity) {
    res.status(400);
    throw new Error("Title, destination, dates, price and capacity are required");
  }
  if (new Date(endDate) < new Date(startDate)) {
    res.status(400);
    throw new Error("End date can't be before the start date");
  }

  const slug = await ensureUniqueSlug(req.body.slug || title);

  const trip = await Trip.create({
    ...req.body,
    slug,
    // A brand-new trip starts fully available; availableSeats only tracks
    // remaining seats from here on and isn't re-derived from capacity later.
    availableSeats: req.body.availableSeats ?? capacity,
  });
  res.status(201).json({ success: true, trip });
});

// @route  PUT /api/trips/:id
// @access Private
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const updates = { ...req.body };
  if (updates.title && updates.title !== trip.title && !req.body.slug) {
    updates.slug = await ensureUniqueSlug(updates.title, trip._id);
  } else if (updates.slug) {
    updates.slug = await ensureUniqueSlug(updates.slug, trip._id);
  }

  // If the admin raises capacity, extend availableSeats by the same delta so
  // already-booked seats aren't silently un-booked. Lowering capacity below
  // what's already booked is rejected rather than going negative.
  if (updates.capacity !== undefined && updates.capacity !== trip.capacity) {
    const bookedSeats = trip.capacity - trip.availableSeats;
    if (updates.capacity < bookedSeats) {
      res.status(400);
      throw new Error(`Capacity can't be lower than the ${bookedSeats} seat(s) already booked`);
    }
    updates.availableSeats = updates.capacity - bookedSeats;
  }

  Object.assign(trip, updates);
  await trip.save();

  res.json({ success: true, trip });
});

// @route  DELETE /api/trips/:id
// @access Private
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (trip.coverImage?.publicId) {
    await deleteAsset(trip.coverImage.publicId, trip.coverImage.resourceType || "image");
  }
  await trip.deleteOne();

  res.json({ success: true, message: "Trip deleted" });
});

// @route  POST /api/trips/:id/cover
// @access Private
export const uploadTripCover = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }

  if (trip.coverImage?.publicId) {
    await deleteAsset(trip.coverImage.publicId, trip.coverImage.resourceType || "image");
  }

  const result = await uploadBuffer(req.file.buffer, "trips");
  trip.coverImage = { url: result.secure_url, publicId: result.public_id, resourceType: "image" };
  await trip.save();

  res.json({ success: true, coverImage: trip.coverImage, trip });
});
