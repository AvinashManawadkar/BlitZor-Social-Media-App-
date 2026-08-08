import api from "../api/axios";

export const toggleBookmark = (postId, userId, collectionName = "Favorites") => {
    const query = collectionName ? `?collectionName=${encodeURIComponent(collectionName)}` : "";
    return api.post(`/bookmarks/${postId}${query}`);
};

export const getBookmarks = (userId) => {
    return api.get(`/bookmarks/user/${userId}`);
};

export const getCollections = (userId) => {
    return api.get(`/bookmarks/collections/${userId}`);
};
