import api from "./api.js";

export const listMembers = (params = {}) => api.get("/members", { params }).then((r) => r.data);
export const updateMember = (id, payload) => api.put(`/members/${id}`, payload).then((r) => r.data);
export const deleteMember = (id) => api.delete(`/members/${id}`).then((r) => r.data);
