import YouTubeVideo from "../models/YouTubeVideo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBuffer, deleteAsset } from "../utils/cloudinaryHelpers.js";

export const getYouTubeVideos = asyncHandler(async (req, res) => {
  const isAdminRequest = Boolean(req.admin);
  const filter = isAdminRequest && req.query.all ? {} : { published: true };
  const videos = await YouTubeVideo.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: videos.length, videos });
});

export const getYouTubeVideoById = asyncHandler(async (req, res) => {
  const video = await YouTubeVideo.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  res.json({ success: true, video });
});

export const createYouTubeVideo = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.youtubeUrl) {
    res.status(400);
    throw new Error("Title and YouTube URL are required");
  }
  const video = await YouTubeVideo.create(req.body);
  res.status(201).json({ success: true, video });
});

export const updateYouTubeVideo = asyncHandler(async (req, res) => {
  const video = await YouTubeVideo.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  Object.assign(video, req.body);
  await video.save();
  res.json({ success: true, video });
});

export const deleteYouTubeVideo = asyncHandler(async (req, res) => {
  const video = await YouTubeVideo.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  if (video.thumbnail?.publicId) await deleteAsset(video.thumbnail.publicId, video.thumbnail.resourceType || "image");
  await video.deleteOne();
  res.json({ success: true, message: "Video deleted" });
});

export const uploadYouTubeThumbnail = asyncHandler(async (req, res) => {
  const video = await YouTubeVideo.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  if (video.thumbnail?.publicId) await deleteAsset(video.thumbnail.publicId, video.thumbnail.resourceType || "image");
  const result = await uploadBuffer(req.file.buffer, "youtube");
  video.thumbnail = { url: result.secure_url, publicId: result.public_id, resourceType: "image" };
  await video.save();
  res.json({ success: true, thumbnail: video.thumbnail, video });
});
