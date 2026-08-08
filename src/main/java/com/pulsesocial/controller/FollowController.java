package com.pulsesocial.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.service.FollowService;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followingId}")
    public String followUser(@RequestParam(required = false) Long followerId, @PathVariable Long followingId) {
        return followService.followUser(followerId, followingId);
    }


    @GetMapping("/followers/{userId}")
    public List<UserResponse> getFollowers(@PathVariable Long userId) {
        return followService.getFollowers(userId);
    }

    @GetMapping("/following/{userId}")
    public List<UserResponse> getFollowing(@PathVariable Long userId) {
        return followService.getFollowing(userId);
    }

    @GetMapping("/followers/count/{userId}")
    public long getFollowersCount(@PathVariable Long userId) {
        return followService.getFollowersCount(userId);
    }

    @GetMapping("/following/count/{userId}")
    public long getFollowingCount(@PathVariable Long userId) {
        return followService.getFollowingCount(userId);
    }
}
