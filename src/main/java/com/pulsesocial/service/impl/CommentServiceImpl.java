package com.pulsesocial.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pulsesocial.dto.CommentRequest;
import com.pulsesocial.dto.CommentResponse;
import com.pulsesocial.entity.Comment;
import com.pulsesocial.entity.Post;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.CommentRepository;
import com.pulsesocial.repository.PostRepository;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.CommentService;
import com.pulsesocial.service.NotificationService;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.pulsesocial.service.UserService userService;

    @Override
    public String addComment(Long userId, Long postId, CommentRequest request) {
        if (userId == null) {
            userId = userService.getCurrentUser().getId();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));


        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post Not Found"));

        Comment comment = new Comment();

        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setPost(post);

        commentRepository.save(comment);

        return "Comment Added Successfully";
    }

    @Override
    public List<CommentResponse> getComments(Long postId) {

        List<Comment> comments = commentRepository.findByPostId(postId);

        List<CommentResponse> response = new ArrayList<>();

        for (Comment comment : comments) {

            CommentResponse dto = new CommentResponse();

            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setCreatedAt(comment.getCreatedAt());
            dto.setUsername(comment.getUser().getUsername());
            dto.setFullName(comment.getUser().getFullName());
            dto.setUserId(comment.getUser().getId());

            response.add(dto);
        }


        return response;
    }

    @Override
    public String deleteComment(Long commentId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment Not Found"));

        commentRepository.delete(comment);

        return "Comment Deleted Successfully";
    }
}