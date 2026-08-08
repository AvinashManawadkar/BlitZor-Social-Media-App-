package com.pulsesocial.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.entity.Follow;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.FollowRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.FollowService;
import com.pulsesocial.service.NotificationService;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.pulsesocial.service.UserService userService;

    @Override
    public String followUser(Long followerId, Long followingId) {
        if (followerId == null) {
            followerId = userService.getCurrentUser().getId();
        }

        if (followerId.equals(followingId)) {
            return "You cannot follow yourself";
        }


        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower Not Found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Optional<Follow> existing =
                followRepository.findByFollowerIdAndFollowingId(followerId, followingId);

        if (existing.isPresent()) {
            followRepository.delete(existing.get());
            return "User Unfollowed Successfully";
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);

        return "User Followed Successfully";
    }

    @Override
    public List<UserResponse> getFollowers(Long userId) {

        List<Follow> followers = followRepository.findByFollowingId(userId);

        List<UserResponse> response = new ArrayList<>();

        for (Follow follow : followers) {

            User user = follow.getFollower();

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
    public List<UserResponse> getFollowing(Long userId) {

        List<Follow> following = followRepository.findByFollowerId(userId);

        List<UserResponse> response = new ArrayList<>();

        for (Follow follow : following) {

            User user = follow.getFollowing();

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
    public long getFollowersCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    @Override
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
}