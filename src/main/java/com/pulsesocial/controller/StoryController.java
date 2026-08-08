package com.pulsesocial.controller;

import com.pulsesocial.dto.CreateStoryRequest;
import com.pulsesocial.dto.StoryResponse;
import com.pulsesocial.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;

    @PostMapping
    public StoryResponse createStory(@RequestBody CreateStoryRequest request) {
        return storyService.createStory(request);
    }

    @GetMapping
    public List<StoryResponse> getAllStories() {
        return storyService.getAllStories();
    }

    @DeleteMapping("/{id}")
    public String deleteStory(@PathVariable Long id) {
        return storyService.deleteStory(id);
    }
}
