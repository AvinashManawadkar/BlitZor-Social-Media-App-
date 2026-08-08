package com.pulsesocial.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.entity.Bookmark;
import com.pulsesocial.entity.Post;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.BookmarkRepository;
import com.pulsesocial.repository.PostRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.BookmarkService;
import com.pulsesocial.service.UserService;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Override
    public String toggleBookmark(Long userId, Long postId, String collectionName) {
        if (userId == null) {
            userId = userService.getCurrentUser().getId();
        }
        if (collectionName == null || collectionName.trim().isEmpty()) {
            collectionName = "Favorites";
        }

        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndPostId(userId, postId);

        if (existing.isPresent()) {
            Bookmark bookmark = existing.get();
            // If already bookmarked under the same collection, remove it
            if (collectionName.equalsIgnoreCase(bookmark.getCollectionName())) {
                bookmarkRepository.delete(bookmark);
                return "Post removed from collection";
            } else {
                // Update collection name
                bookmark.setCollectionName(collectionName);
                bookmarkRepository.save(bookmark);
                return "Moved post to collection: " + collectionName;
            }
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setPost(post);
        bookmark.setCollectionName(collectionName);
        bookmarkRepository.save(bookmark);

        return "Post saved to collection: " + collectionName;
    }

    @Override
    public List<PostResponse> getBookmarks(Long userId) {
        if (userId == null) {
            userId = userService.getCurrentUser().getId();
        }
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        List<PostResponse> responses = new ArrayList<>();

        for (Bookmark bookmark : bookmarks) {
            Post post = bookmark.getPost();
            PostResponse dto = new PostResponse();
            dto.setId(post.getId());
            dto.setContent(post.getContent());
            dto.setImageUrl(post.getImageUrl());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setFullName(post.getUser().getFullName());
            dto.setUsername(post.getUser().getUsername());
            dto.setUserId(post.getUser().getId());
            dto.setCollectionName(bookmark.getCollectionName() != null ? bookmark.getCollectionName() : "Favorites");
            responses.add(dto);
        }

        return responses;
    }

    @Override
    public List<String> getCollections(Long userId) {
        if (userId == null) {
            userId = userService.getCurrentUser().getId();
        }
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        return bookmarks.stream()
                .map(b -> b.getCollectionName() != null ? b.getCollectionName() : "Favorites")
                .distinct()
                .collect(Collectors.toList());
    }
}
