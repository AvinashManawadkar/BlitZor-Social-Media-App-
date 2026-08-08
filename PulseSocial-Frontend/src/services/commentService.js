import api from "../api/axios";

export const addComment = (postId, content, userId) => {
    const url = userId ? `/comments?postId=${postId}&userId=${userId}` : `/comments?postId=${postId}`;
    return api.post(url, { content });
};

export const getComments = (postId) => {
    return api.get(`/comments/post/${postId}`);
};

export const deleteComment = (commentId) => {
    return api.delete(`/comments/${commentId}`);
};
