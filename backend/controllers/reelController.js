import Reel from "../models/Reel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBuffer, deleteAsset } from "../utils/cloudinaryHelpers.js";

export const getReels = asyncHandler(async (req, res) => {
  const isAdminRequest = Boolean(req.admin);
  const filter = isAdminRequest && req.query.all ? {} : { published: true };
  const reels = await Reel.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: reels.length, reels });
});

export const getReelById = asyncHandler(async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error("Reel not found");
  }
  res.json({ success: true, reel });
});

export const createReel = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.instagramUrl) {
    res.status(400);
    throw new Error("Title and Instagram URL are required");
  }
  const reel = await Reel.create(req.body);
  res.status(201).json({ success: true, reel });
});

export const updateReel = asyncHandler(async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error("Reel not found");
  }
  Object.assign(reel, req.body);
  await reel.save();
  res.json({ success: true, reel });
});

export const deleteReel = asyncHandler(async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error("Reel not found");
  }
  // Previously this deleted both assets as "image" by default, which silently
  // failed to remove the video file from Cloudinary (wrong resource type =
  // no match = orphaned asset). Each asset now carries its own resourceType.
  const targets = [reel.thumbnail, reel.videoPreview].filter((asset) => asset?.publicId);
  await Promise.all(targets.map((asset) => deleteAsset(asset.publicId, asset.resourceType || "image")));
  await reel.deleteOne();
  res.json({ success: true, message: "Reel deleted" });
});

export const uploadReelThumbnail = asyncHandler(async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error("Reel not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  if (reel.thumbnail?.publicId) await deleteAsset(reel.thumbnail.publicId, reel.thumbnail.resourceType || "image");
  const result = await uploadBuffer(req.file.buffer, "reels");
  reel.thumbnail = { url: result.secure_url, publicId: result.public_id, resourceType: "image" };
  await reel.save();
  res.json({ success: true, thumbnail: reel.thumbnail, reel });
});

export const uploadReelVideoPreview = asyncHandler(async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error("Reel not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  if (reel.videoPreview?.publicId) await deleteAsset(reel.videoPreview.publicId, "video");
  const result = await uploadBuffer(req.file.buffer, "reels", "video");
  reel.videoPreview = { url: result.secure_url, publicId: result.public_id, resourceType: "video" };
  await reel.save();
  res.json({ success: true, videoPreview: reel.videoPreview, reel });
});
