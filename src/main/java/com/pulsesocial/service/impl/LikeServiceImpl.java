package com.pulsesocial.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pulsesocial.entity.Like;
import com.pulsesocial.entity.Post;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.LikeRepository;
import com.pulsesocial.repository.PostRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.LikeService;
import com.pulsesocial.service.NotificationService;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.pulsesocial.service.UserService userService;

    @Override
    public String toggleLike(Long userId, Long postId) {
        if (userId == null) {
            userId = userService.getCurrentUser().getId();
        }

        Optional<Like> existingLike =
                likeRepository.findByUserIdAndPostId(userId, postId);


        if (existingLike.isPresent()) {

            likeRepository.delete(existingLike.get());

            return "Post Unliked Successfully";
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post Not Found"));

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);

        likeRepository.save(like);
        notificationService.createNotification(
                post.getUser().getId(),
                userId,
                "liked your post"
        );

        return "Post Liked Successfully";
    }

    @Override
    public long getLikeCount(Long postId) {

        return likeRepository.countByPostId(postId);
    }
}