package com.pulsesocial.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pulsesocial.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
}
