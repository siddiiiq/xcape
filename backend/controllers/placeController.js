import Place from "../models/Place.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toSlug } from "../utils/slugify.js";
import { uploadBuffer, deleteAsset } from "../utils/cloudinaryHelpers.js";

const ensureUniqueSlug = async (base, excludeId = null) => {
  let slug = toSlug(base);
  let attempt = 0;
  // Keep trying slug, slug-2, slug-3... until it's free.
  while (
    await Place.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
  ) {
    attempt += 1;
    slug = `${toSlug(base)}-${attempt + 1}`;
  }
  return slug;
};

// @route  GET /api/places
// @access Public (published only) / Private (all, with ?all=true)
export const getPlaces = asyncHandler(async (req, res) => {
  const isAdminRequest = Boolean(req.admin);
  const filter = isAdminRequest && req.query.all ? {} : { published: true };

  const places = await Place.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: places.length, places });
});

// @route  GET /api/places/:slug
// @access Public
export const getPlaceBySlug = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ slug: req.params.slug });

  if (!place || (!place.published && !req.admin)) {
    res.status(404);
    throw new Error("Place not found");
  }

  const related = await Place.find({
    _id: { $ne: place._id },
    published: true,
  })
    .limit(3)
    .select("title slug location coverImage shortDescription");

  res.json({ success: true, place, related });
});

// @route  GET /api/places/id/:id  (admin edit screens fetch by id)
// @access Private
export const getPlaceById = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }
  res.json({ success: true, place });
});

// @route  POST /api/places
// @access Private
export const createPlace = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const slug = await ensureUniqueSlug(req.body.slug || title);

  const place = await Place.create({ ...req.body, slug });
  res.status(201).json({ success: true, place });
});

// @route  PUT /api/places/:id
// @access Private
export const updatePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }

  const updates = { ...req.body };
  if (updates.title && updates.title !== place.title && !req.body.slug) {
    updates.slug = await ensureUniqueSlug(updates.title, place._id);
  } else if (updates.slug) {
    updates.slug = await ensureUniqueSlug(updates.slug, place._id);
  }

  Object.assign(place, updates);
  await place.save();

  res.json({ success: true, place });
});

// @route  DELETE /api/places/:id
// @access Private
export const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }

  // Best-effort cleanup of every Cloudinary asset attached to this place.
  // Uses each asset's stored resourceType rather than assuming "image", so
  // this stays correct if video covers/gallery items are ever supported.
  const cleanupTargets = [place.coverImage, ...place.gallery].filter((asset) => asset?.publicId);

  await Promise.all(cleanupTargets.map((asset) => deleteAsset(asset.publicId, asset.resourceType || "image")));
  await place.deleteOne();

  res.json({ success: true, message: "Place deleted" });
});

// @route  POST /api/places/:id/cover
// @access Private
export const uploadCoverImage = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }

  if (place.coverImage?.publicId) {
    await deleteAsset(place.coverImage.publicId, place.coverImage.resourceType || "image");
  }

  const result = await uploadBuffer(req.file.buffer, "places");
  place.coverImage = { url: result.secure_url, publicId: result.public_id, resourceType: "image" };
  await place.save();

  res.json({ success: true, coverImage: place.coverImage, place });
});

// @route  POST /api/places/:id/images
// @access Private
// Accepts multiple files under field name "images".
export const uploadGalleryImages = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No images uploaded");
  }

  const startOrder = place.gallery.length;

  const uploads = await Promise.all(
    req.files.map((file) => uploadBuffer(file.buffer, "places"))
  );

  const newImages = uploads.map((result, index) => ({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: "image",
    title: "",
    description: "",
    instagramUrl: "",
    order: startOrder + index,
  }));

  place.gallery.push(...newImages);
  await place.save();

  res.status(201).json({ success: true, gallery: place.gallery, place });
});

// @route  PUT /api/places/:id/images/:imageId
// @access Private
// Updates image metadata (title, description, instagramUrl, order) or sets it as cover.
export const updateGalleryImage = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }

  const image = place.gallery.id(req.params.imageId);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  const { title, description, instagramUrl, order, setAsCover } = req.body;

  if (title !== undefined) image.title = title;
  if (description !== undefined) image.description = description;
  if (instagramUrl !== undefined) image.instagramUrl = instagramUrl;
  if (order !== undefined) image.order = order;

  if (setAsCover) {
    place.coverImage = { url: image.url, publicId: image.publicId, resourceType: image.resourceType || "image" };
  }

  await place.save();
  res.json({ success: true, gallery: place.gallery, place });
});

// @route  PUT /api/places/:id/images/reorder
// @access Private
// Body: { order: [imageId, imageId, ...] } in the desired final order.
export const reorderGalleryImages = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }

  const { order } = req.body;
  if (!Array.isArray(order)) {
    res.status(400);
    throw new Error("order must be an array of image ids");
  }

  order.forEach((imageId, index) => {
    const image = place.gallery.id(imageId);
    if (image) image.order = index;
  });

  place.gallery.sort((a, b) => a.order - b.order);
  await place.save();

  res.json({ success: true, gallery: place.gallery });
});

// @route  DELETE /api/places/:id/images/:imageId
// @access Private
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error("Place not found");
  }

  const image = place.gallery.id(req.params.imageId);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  await deleteAsset(image.publicId, image.resourceType || "image");
  place.gallery.pull({ _id: req.params.imageId });
  await place.save();

  res.json({ success: true, gallery: place.gallery });
});
