package com.pulsesocial.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pulsesocial.dto.NotificationResponse;
import com.pulsesocial.entity.Notification;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.NotificationRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void createNotification(Long recipientId, Long actorId, String message) {
        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setActorId(actorId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getNotifications(Long recipientId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
        List<NotificationResponse> responses = new ArrayList<>();

        for (Notification n : notifications) {
            NotificationResponse res = new NotificationResponse();
            res.setId(n.getId());
            res.setRecipientId(n.getRecipientId());
            res.setActorId(n.getActorId());
            res.setMessage(n.getMessage());
            res.setRead(n.isRead());
            res.setCreatedAt(n.getCreatedAt());

            if (n.getActorId() != null) {
                User actor = userRepository.findById(n.getActorId()).orElse(null);
                if (actor != null) {
                    res.setSenderName(actor.getFullName());
                    res.setSenderUsername(actor.getUsername());
                    res.setSenderAvatar(actor.getProfileImage());
                }
            }

            responses.add(res);
        }

        return responses;
    }
}

