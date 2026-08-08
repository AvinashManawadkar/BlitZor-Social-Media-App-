package com.pulsesocial.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pulsesocial.entity.Bookmark;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserIdAndPostId(Long userId, Long postId);
    List<Bookmark> findByUserId(Long userId);
}
