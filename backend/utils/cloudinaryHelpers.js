import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

/**
 * Uploads a file buffer (from multer memory storage) to Cloudinary.
 */
export const uploadBuffer = (buffer, folder, resourceType = "image") => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env"
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `travel-community/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Deletes a Cloudinary asset by public_id. Never throws — a failed cleanup
 * shouldn't block the surrounding DB operation (e.g. deleting a Place).
 */
export const deleteAsset = async (publicId, resourceType = "image") => {
  if (!publicId || !isCloudinaryConfigured()) return { skipped: true };

  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error.message);
    return { error: error.message };
  }
};

export default { uploadBuffer, deleteAsset };
