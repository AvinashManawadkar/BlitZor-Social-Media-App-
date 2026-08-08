package com.pulsesocial.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pulsesocial.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Post> findByContentContainingIgnoreCase(String keyword);
}