package com.pulsesocial.dto;

public class CreatePostRequest {
    private Long userId;
    private String content;
    private String imageUrl;

    public CreatePostRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
