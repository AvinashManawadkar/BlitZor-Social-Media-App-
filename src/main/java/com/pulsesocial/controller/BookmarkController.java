package com.pulsesocial.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.service.BookmarkService;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @PostMapping("/{postId}")
    public String toggleBookmark(
            @RequestParam(required = false) Long userId,
            @PathVariable Long postId,
            @RequestParam(required = false, defaultValue = "Favorites") String collectionName) {
        return bookmarkService.toggleBookmark(userId, postId, collectionName);
    }

    @GetMapping("/user/{userId}")
    public List<PostResponse> getBookmarks(@PathVariable Long userId) {
        return bookmarkService.getBookmarks(userId);
    }

    @GetMapping("/collections/{userId}")
    public List<String> getCollections(@PathVariable Long userId) {
        return bookmarkService.getCollections(userId);
    }
}
