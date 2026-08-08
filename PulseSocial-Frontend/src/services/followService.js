import api from "../api/axios";

export const followUser = (followingId, followerId) => {
    const url = followerId ? `/follows/${followingId}?followerId=${followerId}` : `/follows/${followingId}`;
    return api.post(url);
};

export const getFollowers = (userId) => {
    return api.get(`/follows/followers/${userId}`);
};

export const getFollowing = (userId) => {
    return api.get(`/follows/following/${userId}`);
};

export const getFollowersCount = (userId) => {
    return api.get(`/follows/followers/count/${userId}`);
};

export const getFollowingCount = (userId) => {
    return api.get(`/follows/following/count/${userId}`);
};
