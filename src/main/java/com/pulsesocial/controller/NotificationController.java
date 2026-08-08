package com.pulsesocial.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.NotificationResponse;
import com.pulsesocial.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{recipientId}")
    public List<NotificationResponse> getNotifications(@PathVariable Long recipientId) {
        return notificationService.getNotifications(recipientId);
    }
}

