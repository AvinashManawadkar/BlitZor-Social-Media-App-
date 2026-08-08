package com.pulsesocial.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String uploadProfileImage(MultipartFile file);
    String uploadPostImage(MultipartFile file);
}
