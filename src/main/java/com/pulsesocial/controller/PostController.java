package com.pulsesocial.controller;
import java.util.List;
import com.pulsesocial.dto.PostResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.CreatePostRequest;
import com.pulsesocial.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public String createPost(@RequestBody CreatePostRequest request) {

        return postService.createPost(request);

    }
    @GetMapping
    public List<PostResponse> getAllPosts() {

        return postService.getAllPosts();

    }
    @GetMapping("/{id}")
    public PostResponse getPostById(@PathVariable Long id) {

        return postService.getPostById(id);

    }
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Long id) {

        return postService.deletePost(id);

    }
}