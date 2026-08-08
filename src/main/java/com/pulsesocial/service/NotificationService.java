package com.pulsesocial.service;

import java.util.List;
import com.pulsesocial.dto.NotificationResponse;

public interface NotificationService {
    void createNotification(Long recipientId, Long actorId, String message);
    List<NotificationResponse> getNotifications(Long recipientId);
}

