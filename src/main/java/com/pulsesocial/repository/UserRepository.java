package com.pulsesocial.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pulsesocial.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
    
    

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
    
    List<User> findByUsernameContainingIgnoreCase(String keyword);

    List<User> findByFullNameContainingIgnoreCase(String keyword);
}