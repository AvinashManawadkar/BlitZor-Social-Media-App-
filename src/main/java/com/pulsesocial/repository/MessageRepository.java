package com.pulsesocial.repository;

import com.pulsesocial.entity.Message;
import com.pulsesocial.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :u1 AND m.recipient.id = :u2) OR (m.sender.id = :u2 AND m.recipient.id = :u1) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.recipient ELSE m.sender END FROM Message m WHERE m.sender.id = :userId OR m.recipient.id = :userId")
    List<User> findConversationUsers(@Param("userId") Long userId);
}
