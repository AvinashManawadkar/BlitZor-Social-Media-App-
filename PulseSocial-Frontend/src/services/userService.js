import api from "../api/axios";

export const getCurrentUser = () => {
    return api.get("/users/me");
};

export const getUserById = (id) => {
    return api.get(`/users/${id}`);
};

export const updateUser = (id, data) => {
    return api.put(`/users/${id}`, data);
};

export const uploadProfileImage = (formData) => {
    return api.post("/upload/profile", formData);
};

export const changePassword = (data) => {
    return api.post("/users/change-password", data);
};