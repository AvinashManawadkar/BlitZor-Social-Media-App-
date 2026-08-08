package com.pulsesocial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.service.LikeService;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/{postId}")
    public String toggleLike(@RequestParam(required = false) Long userId, @PathVariable Long postId) {
        return likeService.toggleLike(userId, postId);
    }


    @GetMapping("/count/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        return likeService.getLikeCount(postId);
    }
}
