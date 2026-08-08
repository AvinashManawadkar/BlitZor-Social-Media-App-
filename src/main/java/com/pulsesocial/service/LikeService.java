package com.pulsesocial.service;

public interface LikeService {
    String toggleLike(Long userId, Long postId);
    long getLikeCount(Long postId);
}
