import React, { useState, useRef, useEffect } from 'react';
import './ProjectModal.css';

function ProjectModal({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
  const thumbRef = useRef(null);
  const containerRef = useRef(null);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  // Assuming project.images is an array of image URLs
  // Fallback to project.src if images is not provided
  const images = project.images && project.images.length > 0 ? project.images : [project.src];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Slide to unlock logic
  const handlePointerDown = (e) => {
    e.preventDefault();
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current || !thumbRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const thumbWidth = thumbRef.current.offsetWidth;
    const maxDrag = containerRect.width - thumbWidth - 8; // 8px padding
    
    let newX = e.clientX - containerRect.left - thumbWidth / 2;
    newX = Math.max(0, Math.min(newX, maxDrag));
    
    const progress = newX / maxDrag;
    setDragProgress(progress);
    
    thumbRef.current.style.transform = `translateX(${newX}px)`;
  };

  const handlePointerUp = () => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    
    setDragProgress((prevProgress) => {
      if (prevProgress > 0.9) {
        // Unlock threshold reached
        window.open(project.link, '_blank');
        onClose(); // Optional: close modal after opening link
      } else {
        // Reset thumb
        if (thumbRef.current) {
          thumbRef.current.style.transition = 'transform 0.3s ease';
          thumbRef.current.style.transform = 'translateX(0px)';
          setTimeout(() => {
            if(thumbRef.current) thumbRef.current.style.transition = 'none';
          }, 300);
        }
      }
      return 0; // Reset state
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Image Carousel */}
        <div className="carousel">
          <div 
            className="carousel-images"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Screenshot ${idx + 1}`} className="carousel-img" />
            ))}
          </div>
          
          {images.length > 1 && (
            <>
              <div className="carousel-btn left" onClick={handlePrevImage}>❮</div>
              <div className="carousel-btn right" onClick={handleNextImage}>❯</div>
            </>
          )}
        </div>

        {/* Text Details */}
        <div className="modal-text">
          <h3>{project.h3}</h3>
          <p>{project.p}</p>
        </div>

        {/* Slide to open button */}
        <div className="slide-container" ref={containerRef}>
          <div 
            className="slide-track" 
            style={{ width: `calc(48px + ${dragProgress * 100}%)` }} 
          />
          <div className="slide-text">Slide Untuk Membuka Web</div>
          <div 
            className="slide-thumb" 
            ref={thumbRef}
            onPointerDown={handlePointerDown}
          >
            ❯
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
