package com.pulsesocial.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.CommentRequest;
import com.pulsesocial.dto.CommentResponse;
import com.pulsesocial.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public String addComment(@RequestParam(required = false) Long userId, @RequestParam Long postId, @RequestBody CommentRequest request) {
        return commentService.addComment(userId, postId, request);
    }


    @GetMapping("/post/{postId}")
    public List<CommentResponse> getComments(@PathVariable Long postId) {
        return commentService.getComments(postId);
    }

    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable Long commentId) {
        return commentService.deleteComment(commentId);
    }
}
