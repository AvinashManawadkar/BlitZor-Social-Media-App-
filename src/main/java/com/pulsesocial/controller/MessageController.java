package com.pulsesocial.controller;

import com.pulsesocial.dto.MessageResponse;
import com.pulsesocial.dto.SendMessageRequest;
import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public MessageResponse sendMessage(@RequestBody SendMessageRequest request) {
        return messageService.sendMessage(request);
    }

    @GetMapping("/conversation/{otherUserId}")
    public List<MessageResponse> getConversation(@PathVariable Long otherUserId) {
        return messageService.getConversation(otherUserId);
    }

    @GetMapping("/conversations")
    public List<UserResponse> getRecentConversations() {
        return messageService.getRecentConversations();
    }

    @PutMapping("/{id}")
    public MessageResponse updateMessage(@PathVariable Long id, @RequestBody SendMessageRequest request) {
        return messageService.updateMessage(id, request.getContent());
    }

    @DeleteMapping("/{id}")
    public String deleteMessage(@PathVariable Long id) {
        return messageService.deleteMessage(id);
    }
}
