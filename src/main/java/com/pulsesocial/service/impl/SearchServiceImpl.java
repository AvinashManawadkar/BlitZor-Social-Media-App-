package com.pulsesocial.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.entity.Post;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.PostRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.SearchService;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Override
    public List<UserResponse> searchUsers(String keyword) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(keyword);
        List<UserResponse> response = new ArrayList<>();

        for (User user : users) {
            UserResponse dto = new UserResponse();
            dto.setId(user.getId());
            dto.setFullName(user.getFullName());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setBio(user.getBio());
            dto.setProfileImage(user.getProfileImage());
            response.add(dto);
        }

        return response;
    }

    @Override
    public List<PostResponse> searchPosts(String keyword) {
        List<Post> posts = postRepository.findByContentContainingIgnoreCase(keyword);
        List<PostResponse> response = new ArrayList<>();

        for (Post post : posts) {
            PostResponse dto = new PostResponse();
            dto.setId(post.getId());
            dto.setContent(post.getContent());
            dto.setImageUrl(post.getImageUrl());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setUsername(post.getUser().getUsername());
            dto.setFullName(post.getUser().getFullName());
            response.add(dto);
        }

        return response;
    }
}
