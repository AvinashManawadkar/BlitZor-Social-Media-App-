package com.pulsesocial.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.service.SearchService;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/users")
    public List<UserResponse> searchUsers(@RequestParam String keyword) {
        return searchService.searchUsers(keyword);
    }

    @GetMapping("/posts")
    public List<PostResponse> searchPosts(@RequestParam String keyword) {
        return searchService.searchPosts(keyword);
    }
}
