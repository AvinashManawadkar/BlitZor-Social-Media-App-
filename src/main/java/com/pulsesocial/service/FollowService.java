package com.pulsesocial.service;

import java.util.List;
import com.pulsesocial.dto.UserResponse;

public interface FollowService {
    String followUser(Long followerId, Long followingId);
    List<UserResponse> getFollowers(Long userId);
    List<UserResponse> getFollowing(Long userId);
    long getFollowersCount(Long userId);
    long getFollowingCount(Long userId);
}
