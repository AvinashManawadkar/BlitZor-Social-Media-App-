package com.pulsesocial.service.impl;

import com.pulsesocial.dto.CreateStoryRequest;
import com.pulsesocial.dto.StoryResponse;
import com.pulsesocial.entity.Story;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.StoryRepository;
import com.pulsesocial.service.StoryService;
import com.pulsesocial.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserService userService;

    @Override
    public StoryResponse createStory(CreateStoryRequest request) {
        User user = userService.getCurrentUser();

        Story story = new Story();
        story.setImageUrl(request.getImageUrl());
        story.setCaption(request.getCaption());
        story.setUser(user);

        Story saved = storyRepository.save(story);

        return mapToResponse(saved);
    }

    @Override
    public List<StoryResponse> getAllStories() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        List<Story> stories = storyRepository.findByCreatedAtAfterOrderByCreatedAtDesc(cutoff);
        List<StoryResponse> responses = new ArrayList<>();

        for (Story story : stories) {
            responses.add(mapToResponse(story));
        }

        return responses;
    }

    @Override
    public String deleteStory(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        storyRepository.delete(story);
        return "Story deleted successfully";
    }

    @Scheduled(fixedRate = 600000)
    public void deleteExpiredStories() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        storyRepository.deleteByCreatedAtBefore(cutoff);
    }

    private StoryResponse mapToResponse(Story story) {
        StoryResponse res = new StoryResponse();
        res.setId(story.getId());
        res.setImageUrl(story.getImageUrl());
        res.setCaption(story.getCaption());
        res.setCreatedAt(story.getCreatedAt());

        if (story.getUser() != null) {
            res.setUserId(story.getUser().getId());
            res.setUsername(story.getUser().getUsername());
            res.setFullName(story.getUser().getFullName());
            res.setProfileImage(story.getUser().getProfileImage());
        }

        return res;
    }
}

