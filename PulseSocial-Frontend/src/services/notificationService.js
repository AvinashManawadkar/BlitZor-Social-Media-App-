import api from "../api/axios";

export const getNotifications = (recipientId) => {
    return api.get(`/notifications/user/${recipientId}`);
};
