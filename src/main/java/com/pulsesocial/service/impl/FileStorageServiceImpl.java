package com.pulsesocial.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pulsesocial.service.FileStorageService;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String uploadProfileImage(MultipartFile file) {
        return saveImage(file, "profiles");
    }

    @Override
    public String uploadPostImage(MultipartFile file) {
        return saveImage(file, "posts");
    }

    private String saveImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            return "";
        }

        try {
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + extension;
            Path absoluteFolderPath = Paths.get(uploadDir, folder).toAbsolutePath();

            if (!Files.exists(absoluteFolderPath)) {
                Files.createDirectories(absoluteFolderPath);
            }

            Path absoluteFilePath = absoluteFolderPath.resolve(fileName);
            file.transferTo(absoluteFilePath.toFile());

            return "/uploads/" + folder + "/" + fileName;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }
}