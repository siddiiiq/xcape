import api from "./api.js";

export const listMedia = (params = {}) => api.get("/media", { params }).then((r) => r.data);
export const deleteMedia = (publicId, resourceType = "image") =>
  api.delete("/media", { data: { publicId, resourceType } }).then((r) => r.data);
