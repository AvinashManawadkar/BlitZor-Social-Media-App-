package com.pulsesocial.service;

import java.util.List;
import com.pulsesocial.dto.PostResponse;

public interface BookmarkService {
    String toggleBookmark(Long userId, Long postId, String collectionName);
    List<PostResponse> getBookmarks(Long userId);
    List<String> getCollections(Long userId);
}
