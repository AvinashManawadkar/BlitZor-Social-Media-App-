package com.pulsesocial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pulsesocial.service.FileStorageService;
import com.pulsesocial.service.UserService;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserService userService;

    @PostMapping("/profile")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {

        String imageUrl = fileStorageService.uploadProfileImage(file);
        userService.updateProfileImage(imageUrl);

        return ResponseEntity.ok(imageUrl);
    }

    @PostMapping("/post")
    public ResponseEntity<String> uploadPostImage(
            @RequestParam("file") MultipartFile file) {

        String imageUrl = fileStorageService.uploadPostImage(file);

        return ResponseEntity.ok(imageUrl);
    }
}