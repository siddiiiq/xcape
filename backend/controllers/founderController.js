import Founder from "../models/Founder.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toSlug } from "../utils/slugify.js";
import { uploadBuffer, deleteAsset } from "../utils/cloudinaryHelpers.js";

const ensureUniqueSlug = async (base, excludeId = null) => {
  let slug = toSlug(base);
  let attempt = 0;
  while (
    await Founder.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
  ) {
    attempt += 1;
    slug = `${toSlug(base)}-${attempt + 1}`;
  }
  return slug;
};

export const getFounders = asyncHandler(async (req, res) => {
  const isAdminRequest = Boolean(req.admin);
  const filter = isAdminRequest && req.query.all ? {} : { published: true };
  const founders = await Founder.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: founders.length, founders });
});

export const getFounderBySlug = asyncHandler(async (req, res) => {
  const founder = await Founder.findOne({ slug: req.params.slug });
  if (!founder || (!founder.published && !req.admin)) {
    res.status(404);
    throw new Error("Founder not found");
  }
  res.json({ success: true, founder });
});

export const getFounderById = asyncHandler(async (req, res) => {
  const founder = await Founder.findById(req.params.id);
  if (!founder) {
    res.status(404);
    throw new Error("Founder not found");
  }
  res.json({ success: true, founder });
});

export const createFounder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  const slug = await ensureUniqueSlug(req.body.slug || name);
  const founder = await Founder.create({ ...req.body, slug });
  res.status(201).json({ success: true, founder });
});

export const updateFounder = asyncHandler(async (req, res) => {
  const founder = await Founder.findById(req.params.id);
  if (!founder) {
    res.status(404);
    throw new Error("Founder not found");
  }
  const updates = { ...req.body };
  if (updates.name && updates.name !== founder.name && !req.body.slug) {
    updates.slug = await ensureUniqueSlug(updates.name, founder._id);
  } else if (updates.slug) {
    updates.slug = await ensureUniqueSlug(updates.slug, founder._id);
  }
  Object.assign(founder, updates);
  await founder.save();
  res.json({ success: true, founder });
});

export const deleteFounder = asyncHandler(async (req, res) => {
  const founder = await Founder.findById(req.params.id);
  if (!founder) {
    res.status(404);
    throw new Error("Founder not found");
  }
  const cleanupTargets = [founder.profileImage, ...founder.gallery].filter((asset) => asset?.publicId);
  await Promise.all(cleanupTargets.map((asset) => deleteAsset(asset.publicId, asset.resourceType || "image")));
  await founder.deleteOne();
  res.json({ success: true, message: "Founder deleted" });
});

export const uploadFounderProfileImage = asyncHandler(async (req, res) => {
  const founder = await Founder.findById(req.params.id);
  if (!founder) {
    res.status(404);
    throw new Error("Founder not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }
  if (founder.profileImage?.publicId) {
    await deleteAsset(founder.profileImage.publicId, founder.profileImage.resourceType || "image");
  }
  const result = await uploadBuffer(req.file.buffer, "founders");
  founder.profileImage = { url: result.secure_url, publicId: result.public_id, resourceType: "image" };
  await founder.save();
  res.json({ success: true, profileImage: founder.profileImage, founder });
});

export const uploadFounderGalleryImages = asyncHandler(async (req, res) => {
  const founder = await Founder.findById(req.params.id);
  if (!founder) {
    res.status(404);
    throw new Error("Founder not found");
  }
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No images uploaded");
  }
  const uploads = await Promise.all(
    req.files.map((file) => uploadBuffer(file.buffer, "founders"))
  );
  const newImages = uploads.map((result) => ({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: "image",
  }));
  founder.gallery.push(...newImages);
  await founder.save();
  res.status(201).json({ success: true, gallery: founder.gallery, founder });
});

export const deleteFounderGalleryImage = asyncHandler(async (req, res) => {
  const founder = await Founder.findById(req.params.id);
  if (!founder) {
    res.status(404);
    throw new Error("Founder not found");
  }
  const image = founder.gallery.id(req.params.imageId);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }
  await deleteAsset(image.publicId, image.resourceType || "image");
  founder.gallery.pull({ _id: req.params.imageId });
  await founder.save();
  res.json({ success: true, gallery: founder.gallery });
});
