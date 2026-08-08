import api from "../api/axios";

export const createStory = (data) => {
    return api.post("/stories", data);
};

export const getAllStories = () => {
    return api.get("/stories");
};

export const deleteStory = (id) => {
    return api.delete(`/stories/${id}`);
};
