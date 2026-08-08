import api from "../api/axios";

export const toggleLike = (postId, userId) => {
    return api.post(`/likes/${postId}?userId=${userId || ''}`);
};

export const getLikeCount = (postId) => {
    return api.get(`/likes/count/${postId}`);
};
