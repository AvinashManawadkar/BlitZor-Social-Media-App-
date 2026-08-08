package com.pulsesocial.service;

import com.pulsesocial.dto.ChangePasswordRequest;
import com.pulsesocial.dto.UpdateUserRequest;
import com.pulsesocial.dto.UserResponse;
import com.pulsesocial.entity.User;

public interface UserService {
    UserResponse getUserById(Long id);
    String updateUser(Long id, UpdateUserRequest request);
    User getCurrentUser();
    UserResponse getCurrentUserResponse();
    String updateProfileImage(String imageUrl);
    String changePassword(ChangePasswordRequest request);
}