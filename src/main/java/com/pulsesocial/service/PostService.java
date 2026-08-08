package com.pulsesocial.service;

import java.util.List;

import com.pulsesocial.dto.CreatePostRequest;
import com.pulsesocial.dto.PostResponse;

public interface PostService {

    String createPost(CreatePostRequest request);

    List<PostResponse> getAllPosts();

    PostResponse getPostById(Long id);

    List<PostResponse> getFollowingFeed(Long userId);

    String deletePost(Long id);

}