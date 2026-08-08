package com.pulsesocial.service;

import java.util.List;
import com.pulsesocial.dto.PostResponse;
import com.pulsesocial.dto.UserResponse;

public interface SearchService {
    List<UserResponse> searchUsers(String keyword);
    List<PostResponse> searchPosts(String keyword);
}