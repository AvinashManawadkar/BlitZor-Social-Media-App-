package com.pulsesocial.service;

import com.pulsesocial.dto.CreateStoryRequest;
import com.pulsesocial.dto.StoryResponse;
import java.util.List;

public interface StoryService {
    StoryResponse createStory(CreateStoryRequest request);
    List<StoryResponse> getAllStories();
    String deleteStory(Long id);
}
