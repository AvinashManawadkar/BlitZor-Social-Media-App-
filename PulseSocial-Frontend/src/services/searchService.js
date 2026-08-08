import api from "../api/axios";

export const searchUsers = (keyword) => {
    return api.get(`/search/users?keyword=${encodeURIComponent(keyword)}`);
};

export const searchPosts = (keyword) => {
    return api.get(`/search/posts?keyword=${encodeURIComponent(keyword)}`);
};
