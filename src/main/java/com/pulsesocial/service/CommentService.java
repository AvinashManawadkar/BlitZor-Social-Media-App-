package com.pulsesocial.service;

import java.util.List;
import com.pulsesocial.dto.CommentRequest;
import com.pulsesocial.dto.CommentResponse;

public interface CommentService {
    String addComment(Long userId, Long postId, CommentRequest request);
    List<CommentResponse> getComments(Long postId);
    String deleteComment(Long commentId);
}
