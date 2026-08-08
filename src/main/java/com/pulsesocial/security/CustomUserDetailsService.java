package com.pulsesocial.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.pulsesocial.entity.User;
import com.pulsesocial.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        String cleanInput = input != null ? input.trim() : "";
        User user = userRepository.findByEmail(cleanInput)
                .or(() -> userRepository.findByUsername(cleanInput))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + cleanInput));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }

}
