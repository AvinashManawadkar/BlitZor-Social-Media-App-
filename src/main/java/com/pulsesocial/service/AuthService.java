package com.pulsesocial.service;

import com.pulsesocial.dto.LoginRequest;
import com.pulsesocial.dto.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest request);
    String login(LoginRequest request);
}
