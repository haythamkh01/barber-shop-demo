import { useEffect, useState } from "react";
import "./Gallery.css";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/gallery");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Fetch images error:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (images.length >= 15) {
      alert("Maximum 15 images allowed.");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8080/api/gallery", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      await fetchImages();
    } else {
      const error = await response.text();
      alert(error);
    }
  };

  const handleDeleteImage = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/api/gallery/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      await fetchImages();
      setCurrentIndex(0);
    } else {
      const error = await response.text();
      alert(error);
    }
  };

 const nextSlide = () => {
  if (images.length <= 3) return;

  setCurrentIndex((prev) => {
    return prev + 1 > images.length - 3 ? 0 : prev + 1;
  });
};
const prevSlide = () => {
  if (images.length <= 3) return;

  setCurrentIndex((prev) => {
    return prev - 1 < 0 ? images.length - 3 : prev - 1;
  });
};

  const currentImage = images[currentIndex];
  const visibleImages = images.slice(currentIndex, currentIndex + 3);

  return (
    <section className="gallery-section" id="gallery">
      <h2>Our Work</h2>
      <p>Take a look at some of our recent styles and cuts.</p>

      <div className="gallery-slider">
        <button className="arrow-btn" onClick={prevSlide}>
          &#10094;
        </button>

        <div className="gallery-images-grid">
        {visibleImages.length > 0 ? (
         visibleImages.map((image) => (
      <div className="gallery-card" key={image.id}>
        <img
          src={"http://localhost:8080" + image.imageUrl}
          alt="Barber work"
          className="gallery-image"
        />

        {isAdmin && (
          <button
            className="gallery-delete-btn"
            onClick={() => handleDeleteImage(image.id)}
          >
            Delete
          </button>
        )}
      </div>
    ))
  ) : (
    <div className="no-images">No images yet</div>
  )}
</div>

        <button className="arrow-btn" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      <div className="gallery-footer">
        <span>{images.length} / 15 images</span>

        {isAdmin && (
          <label className="upload-btn">
            Add Image
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              hidden
            />
          </label>
        )}
      </div>
    </section>
  );
}