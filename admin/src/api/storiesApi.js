import api from "./api.js";

export const listStories = () => api.get("/stories?all=true").then((r) => r.data);
export const getStory = (id) => api.get(`/stories/id/${id}`).then((r) => r.data);
export const createStory = (payload) => api.post("/stories", payload).then((r) => r.data);
export const updateStory = (id, payload) => api.put(`/stories/${id}`, payload).then((r) => r.data);
export const deleteStory = (id) => api.delete(`/stories/${id}`).then((r) => r.data);

export const uploadStoryCover = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post(`/stories/${id}/cover`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};
