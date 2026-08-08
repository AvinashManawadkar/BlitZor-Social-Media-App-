import api from "../api/axios";

export const sendMessage = (data) => {
    return api.post("/messages", data);
};

export const getConversation = (otherUserId) => {
    return api.get(`/messages/conversation/${otherUserId}`);
};

export const getRecentConversations = () => {
    return api.get("/messages/conversations");
};

export const updateMessage = (id, content) => {
    return api.put(`/messages/${id}`, { content });
};

export const deleteMessage = (id) => {
    return api.delete(`/messages/${id}`);
};
