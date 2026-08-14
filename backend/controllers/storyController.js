import Story from "../models/Story.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toSlug } from "../utils/slugify.js";
import { uploadBuffer, deleteAsset } from "../utils/cloudinaryHelpers.js";

const ensureUniqueSlug = async (base, excludeId = null) => {
  let slug = toSlug(base);
  let attempt = 0;
  while (
    await Story.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
  ) {
    attempt += 1;
    slug = `${toSlug(base)}-${attempt + 1}`;
  }
  return slug;
};

export const getStories = asyncHandler(async (req, res) => {
  const isAdminRequest = Boolean(req.admin);
  const filter = isAdminRequest && req.query.all ? {} : { published: true };
  const stories = await Story.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .populate("place", "title slug");
  res.json({ success: true, count: stories.length, stories });
});

export const getStoryBySlug = asyncHandler(async (req, res) => {
  const story = await Story.findOne({ slug: req.params.slug }).populate("place", "title slug coverImage");
  if (!story || (!story.published && !req.admin)) {
    res.status(404);
    throw new Error("Story not found");
  }
  res.json({ success: true, story });
});

export const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  res.json({ success: true, story });
});

export const createStory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const slug = await ensureUniqueSlug(req.body.slug || title);
  const story = await Story.create({ ...req.body, slug });
  res.status(201).json({ success: true, story });
});

export const updateStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  const updates = { ...req.body };
  if (updates.title && updates.title !== story.title && !req.body.slug) {
    updates.slug = await ensureUniqueSlug(updates.title, story._id);
  } else if (updates.slug) {
    updates.slug = await ensureUniqueSlug(updates.slug, story._id);
  }
  Object.assign(story, updates);
  await story.save();
  res.json({ success: true, story });
});

export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  if (story.coverImage?.publicId) {
    await deleteAsset(story.coverImage.publicId, story.coverImage.resourceType || "image");
  }
  await story.deleteOne();
  res.json({ success: true, message: "Story deleted" });
});

export const uploadStoryCover = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }
  if (story.coverImage?.publicId) {
    await deleteAsset(story.coverImage.publicId, story.coverImage.resourceType || "image");
  }
  const result = await uploadBuffer(req.file.buffer, "stories");
  story.coverImage = { url: result.secure_url, publicId: result.public_id, resourceType: "image" };
  await story.save();
  res.json({ success: true, coverImage: story.coverImage, story });
});
