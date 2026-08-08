package com.pulsesocial.service.impl;

import com.pulsesocial.dto.MessageResponse;
import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.dto.SendMessageRequest;
import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.entity.Message;
import com.pulsesocial.entity.Post;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.MessageRepository;
import com.pulsesocial.repository.PostRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.MessageService;
import com.pulsesocial.service.NotificationService;
import com.pulsesocial.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public MessageResponse sendMessage(SendMessageRequest request) {
        User sender = userService.getCurrentUser();
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(request.getContent());

        if (request.getSharedPostId() != null) {
            Post sharedPost = postRepository.findById(request.getSharedPostId()).orElse(null);
            message.setSharedPost(sharedPost);
        }

        Message saved = messageRepository.save(message);

        // Send instant notification to recipient
        String snippet = request.getContent() != null && request.getContent().length() > 35
                ? request.getContent().substring(0, 35) + "..."
                : (request.getContent() != null ? request.getContent() : "Shared a post with you");

        String notifMsg = sender.getFullName() + " sent you a message: \"" + snippet + "\"";
        notificationService.createNotification(recipient.getId(), sender.getId(), notifMsg);

        return mapToResponse(saved);
    }

    @Override
    public List<MessageResponse> getConversation(Long otherUserId) {
        User currentUser = userService.getCurrentUser();
        List<Message> messages = messageRepository.findConversation(currentUser.getId(), otherUserId);
        List<MessageResponse> responses = new ArrayList<>();

        for (Message m : messages) {
            responses.add(mapToResponse(m));
        }

        return responses;
    }

    @Override
    public List<UserResponse> getRecentConversations() {
        User currentUser = userService.getCurrentUser();
        List<User> conversationUsers = messageRepository.findConversationUsers(currentUser.getId());

        List<UserResponse> responses = new ArrayList<>();
        for (User u : conversationUsers) {
            if (u != null && !u.getId().equals(currentUser.getId())) {
                UserResponse dto = new UserResponse();
                dto.setId(u.getId());
                dto.setFullName(u.getFullName());
                dto.setUsername(u.getUsername());
                dto.setProfileImage(u.getProfileImage());
                dto.setBio(u.getBio());
                responses.add(dto);
            }
        }

        return responses;
    }

    @Override
    public MessageResponse updateMessage(Long id, String newContent) {
        User currentUser = userService.getCurrentUser();
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to edit this message");
        }

        message.setContent(newContent);
        message.setEdited(true);
        Message updated = messageRepository.save(message);
        return mapToResponse(updated);
    }

    @Override
    public String deleteMessage(Long id) {
        User currentUser = userService.getCurrentUser();
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getSender().getId().equals(currentUser.getId()) &&
            !message.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to delete this message");
        }

        messageRepository.delete(message);
        return "Message deleted successfully";
    }

    private MessageResponse mapToResponse(Message message) {
        MessageResponse dto = new MessageResponse();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setRead(message.isRead());
        dto.setEdited(message.isEdited());
        dto.setCreatedAt(message.getCreatedAt());

        if (message.getSender() != null) {
            dto.setSenderId(message.getSender().getId());
            dto.setSenderName(message.getSender().getFullName());
            dto.setSenderUsername(message.getSender().getUsername());
            dto.setSenderAvatar(message.getSender().getProfileImage());
        }

        if (message.getRecipient() != null) {
            dto.setRecipientId(message.getRecipient().getId());
            dto.setRecipientName(message.getRecipient().getFullName());
            dto.setRecipientUsername(message.getRecipient().getUsername());
            dto.setRecipientAvatar(message.getRecipient().getProfileImage());
        }

        if (message.getSharedPost() != null) {
            Post post = message.getSharedPost();
            PostResponse postDto = new PostResponse();
            postDto.setId(post.getId());
            postDto.setContent(post.getContent());
            postDto.setImageUrl(post.getImageUrl());
            postDto.setCreatedAt(post.getCreatedAt());
            if (post.getUser() != null) {
                postDto.setUserId(post.getUser().getId());
                postDto.setUsername(post.getUser().getUsername());
                postDto.setFullName(post.getUser().getFullName());
            }
            dto.setSharedPost(postDto);
        }

        return dto;
    }
}
