package com.pulsesocial.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.ArrayList;
import java.util.Comparator;

import com.pulsesocial.entity.Follow;
import com.pulsesocial.entity.Post;
import com.pulsesocial.dto.PostResponse;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

import com.pulsesocial.dto.CreatePostRequest;
import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.entity.Post;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.FollowRepository;
import com.pulsesocial.repository.PostRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.PostService;

@Service
public  class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private com.pulsesocial.service.UserService userService;

    @Override
    public String createPost(CreatePostRequest request) {
        User user;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            user = userService.getCurrentUser();
        }

        Post post = new Post();

        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setUser(user);

        postRepository.save(post);

        return "Post Created Successfully";
    }
    @Override
    public List<PostResponse> getAllPosts() {

        List<Post> posts = postRepository.findAll();

        List<PostResponse> responseList = new ArrayList<>();

        for (Post post : posts) {

            PostResponse response = new PostResponse();

            response.setId(post.getId());
            response.setContent(post.getContent());
            response.setImageUrl(post.getImageUrl());
            response.setCreatedAt(post.getCreatedAt());

            response.setFullName(post.getUser().getFullName());
            response.setUsername(post.getUser().getUsername());
            response.setUserId(post.getUser().getId());

            responseList.add(response);
        }

        return responseList;
        
        
    }
    @Override
    public PostResponse getPostById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post Not Found"));

        PostResponse response = new PostResponse();

        response.setId(post.getId());
        response.setFullName(post.getUser().getFullName());
        response.setUsername(post.getUser().getUsername());
        response.setUserId(post.getUser().getId());
        response.setContent(post.getContent());
        response.setImageUrl(post.getImageUrl());
        response.setCreatedAt(post.getCreatedAt());

        return response;
    }
    
    @Override
    public List<PostResponse> getFollowingFeed(Long userId) {

        List<Follow> following = followRepository.findByFollowerId(userId);

        List<Post> posts = new ArrayList<>();

        for (Follow follow : following) {
            posts.addAll(
                    postRepository.findByUserIdOrderByCreatedAtDesc(
                            follow.getFollowing().getId()));
        }

        posts.sort(Comparator.comparing(Post::getCreatedAt).reversed());

        List<PostResponse> response = new ArrayList<>();

        for (Post post : posts) {

            PostResponse dto = new PostResponse();

            dto.setId(post.getId());
            dto.setContent(post.getContent());
            dto.setImageUrl(post.getImageUrl());
            dto.setCreatedAt(post.getCreatedAt());

            dto.setUsername(post.getUser().getUsername());
            dto.setFullName(post.getUser().getFullName());
            dto.setUserId(post.getUser().getId());

            response.add(dto);
        }


        return response;
    }
    @Override
    public String deletePost(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post Not Found"));

        postRepository.delete(post);

        return "Post Deleted Successfully";
    }
}