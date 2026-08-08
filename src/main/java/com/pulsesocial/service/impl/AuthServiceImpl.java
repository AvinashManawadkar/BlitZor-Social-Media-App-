package com.pulsesocial.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pulsesocial.dto.LoginRequest;
import com.pulsesocial.dto.RegisterRequest;
import com.pulsesocial.entity.User;
import com.pulsesocial.repository.UserRepository;
import com.pulsesocial.service.AuthService;
import com.pulsesocial.security.JwtService;


import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public String register(RegisterRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String cleanUsername = request.getUsername() != null ? request.getUsername().trim() : "";

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        if (userRepository.existsByUsername(cleanUsername)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : "");
        user.setUsername(cleanUsername);
        user.setEmail(cleanEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBio("");
        user.setProfileImage("");
        user.setCoverImage("");

        userRepository.save(user);

        return "Registration Successful";
    }

    @Override
    public String login(LoginRequest request) {
        String input = request.getEmail() != null ? request.getEmail().trim() : "";

        Optional<User> optionalUser = userRepository.findByEmail(input.toLowerCase())
                .or(() -> userRepository.findByUsername(input));

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Email or Username");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return jwtService.generateToken(userDetails);
    }
}
