import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteAsset } from "../utils/cloudinaryHelpers.js";

// The media library reads directly from Cloudinary (by folder prefix) rather
// than duplicating asset records in MongoDB, so there's a single source of
// truth and nothing can drift out of sync between the two.

// @route  GET /api/media?folder=places&search=&nextCursor=
// @access Private
export const getMedia = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.json({ success: true, resources: [], nextCursor: null, configured: false });
  }

  const { folder = "", nextCursor, search } = req.query;
  const prefix = `travel-community/${folder}`.replace(/\/$/, "");

  let expression = `folder:${prefix}*`;
  if (search) {
    expression += ` AND filename:*${search}*`;
  }

  const result = await cloudinary.search
    .expression(expression)
    .sort_by("created_at", "desc")
    .max_results(40)
    .next_cursor(nextCursor || undefined)
    .execute();

  res.json({
    success: true,
    resources: result.resources.map((r) => ({
      publicId: r.public_id,
      url: r.secure_url,
      format: r.format,
      resourceType: r.resource_type,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
      createdAt: r.created_at,
      folder: r.folder,
    })),
    nextCursor: result.next_cursor || null,
    configured: true,
  });
});

// @route  DELETE /api/media
// @access Private
// Body: { publicId, resourceType }
export const deleteMedia = asyncHandler(async (req, res) => {
  const { publicId, resourceType = "image" } = req.body;
  if (!publicId) {
    res.status(400);
    throw new Error("publicId is required");
  }
  const result = await deleteAsset(publicId, resourceType);
  res.json({ success: true, result });
});
