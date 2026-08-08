package com.pulsesocial.dto;

public class CreateStoryRequest {
    private String imageUrl;
    private String caption;

    public CreateStoryRequest() {}

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
}
