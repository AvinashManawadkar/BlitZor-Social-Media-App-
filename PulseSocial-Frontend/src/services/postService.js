import api from "../api/axios";

export const getAllPosts = () => {
    return api.get("/posts");
};

export const createPost = (post) => {
    return api.post("/posts", post);
};

export const uploadPostImage = (formData) => {
    return api.post("/upload/post", formData);
};

export const deletePost = (postId) => {
    return api.delete(`/posts/${postId}`);
};