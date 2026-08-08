package com.pulsesocial.dto;

import java.time.LocalDateTime;

public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderUsername;
    private String senderAvatar;
    private Long recipientId;
    private String recipientName;
    private String recipientUsername;
    private String recipientAvatar;
    private String content;
    private PostResponse sharedPost;
    private boolean isRead;
    private boolean isEdited;
    private LocalDateTime createdAt;

    public MessageResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public String getSenderAvatar() { return senderAvatar; }
    public void setSenderAvatar(String senderAvatar) { this.senderAvatar = senderAvatar; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientUsername() { return recipientUsername; }
    public void setRecipientUsername(String recipientUsername) { this.recipientUsername = recipientUsername; }

    public String getRecipientAvatar() { return recipientAvatar; }
    public void setRecipientAvatar(String recipientAvatar) { this.recipientAvatar = recipientAvatar; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public PostResponse getSharedPost() { return sharedPost; }
    public void setSharedPost(PostResponse sharedPost) { this.sharedPost = sharedPost; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public boolean isEdited() { return isEdited; }
    public void setEdited(boolean edited) { isEdited = edited; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
