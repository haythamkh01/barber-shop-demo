package backend.gallery.service;

import backend.gallery.entity.GalleryImage;
import backend.gallery.repository.GalleryImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryService {

    private final GalleryImageRepository galleryImageRepository;
    private final Path uploadPath = Paths.get("uploads/gallery");

    public GalleryService(GalleryImageRepository galleryImageRepository) {
        this.galleryImageRepository = galleryImageRepository;
    }

    public List<GalleryImage> getAllImages() {
        return galleryImageRepository.findAll();
    }

    public GalleryImage uploadImage(MultipartFile file) throws IOException {

        if (galleryImageRepository.count() >= 15) {
            throw new RuntimeException("Maximum 15 images allowed.");
        }

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty.");
        }

        Files.createDirectories(uploadPath);

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = "/uploads/gallery/" + fileName;

        GalleryImage galleryImage = new GalleryImage(fileName, imageUrl);
        return galleryImageRepository.save(galleryImage);
    }

    public void deleteImage(Long id) throws IOException {

        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found."));

        Path filePath = uploadPath.resolve(image.getFileName());

        Files.deleteIfExists(filePath);

        galleryImageRepository.delete(image);
    }
}