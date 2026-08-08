package com.pulsesocial.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class SendMessageRequest {
    @JsonAlias({"receiverId", "recipientId"})
    private Long recipientId;
    private String content;
    private Long sharedPostId;

    public SendMessageRequest() {}

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public Long getReceiverId() { return recipientId; }
    public void setReceiverId(Long receiverId) { this.recipientId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getSharedPostId() { return sharedPostId; }
    public void setSharedPostId(Long sharedPostId) { this.sharedPostId = sharedPostId; }
}

