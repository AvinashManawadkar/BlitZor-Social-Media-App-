package com.pulsesocial.controller;
import com.pulsesocial.dto.UpdateUserRequest;
import com.pulsesocial.entity.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public UserResponse getMe() {
        return userService.getCurrentUserResponse();
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {

        return userService.getUserById(id);

    }

    @PutMapping("/{id}")
    public String updateUser(@PathVariable Long id,
                             @RequestBody UpdateUserRequest request) {

        return userService.updateUser(id, request);
        
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody com.pulsesocial.dto.ChangePasswordRequest request) {
        return userService.changePassword(request);
    }
}