package com.pulsesocial.service;

import com.pulsesocial.dto.MessageResponse;
import com.pulsesocial.dto.SendMessageRequest;
import com.pulsesocial.dto.UserResponse;
import java.util.List;

public interface MessageService {
    MessageResponse sendMessage(SendMessageRequest request);
    List<MessageResponse> getConversation(Long otherUserId);
    List<UserResponse> getRecentConversations();
    MessageResponse updateMessage(Long id, String newContent);
    String deleteMessage(Long id);
}
