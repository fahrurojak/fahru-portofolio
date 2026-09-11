import { useState, useRef, useEffect } from 'react';
import './ProjectModal.css';
import { useLanguage } from '../LanguageContext';

function ProjectModal({ project, onClose }) {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
  const dragProgressRef = useRef(0);
  const thumbRef = useRef(null);
  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus?.();
    };
  }, []);

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
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current || !thumbRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const thumbWidth = thumbRef.current.offsetWidth;
    const maxDrag = containerRect.width - thumbWidth - 8; // 8px padding
    if (maxDrag <= 0) return;
    
    let newX = e.clientX - containerRect.left - thumbWidth / 2;
    newX = Math.max(0, Math.min(newX, maxDrag));
    
    const progress = newX / maxDrag;
    dragProgressRef.current = progress;
    setDragProgress(progress);
    
    thumbRef.current.style.transform = `translateX(${newX}px)`;
  };

  const openProject = () => {
    const openedWindow = window.open(project.link, '_blank', 'noopener,noreferrer');
    if (openedWindow) openedWindow.opener = null;
    onClose();
  };

  const resetSlider = () => {
    if (thumbRef.current) {
      thumbRef.current.style.transition = 'transform 0.3s ease';
      thumbRef.current.style.transform = 'translateX(0px)';
      setTimeout(() => {
        if (thumbRef.current) thumbRef.current.style.transition = 'none';
      }, 300);
    }
    dragProgressRef.current = 0;
    setDragProgress(0);
  };

  const handlePointerUp = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (dragProgressRef.current > 0.9) {
      openProject();
    } else {
      resetSlider();
    }
  };

  const handlePointerCancel = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    resetSlider();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeButtonRef} type="button" className="close-button" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Image Carousel */}
        <div className="carousel">
          <div 
            className="carousel-images"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Screenshot ${idx + 1}`} className="carousel-img" loading="lazy" />
            ))}
          </div>
          
          {images.length > 1 && (
            <>
              <button type="button" className="carousel-btn left" onClick={handlePrevImage} aria-label="Previous image">❮</button>
              <button type="button" className="carousel-btn right" onClick={handleNextImage} aria-label="Next image">❯</button>
            </>
          )}
        </div>

        {/* Text Details */}
        <div className="modal-text">
          <h3 id="project-modal-title">{project.h3}</h3>
          {project.techStack && (
            <div className="modal-tech-stack">
              <span>Tech Stack : </span>
              <div className="tech-stack-icons">
                {project.techStack.map((IconElement, idx) => (
                  <span key={idx} className="tech-icon">
                    {IconElement}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p>{project.p}</p>
        </div>

        {/* Only show the project opener when a destination is available. */}
        {project.link ? (
        <div className="slide-container" ref={containerRef}>
          <div 
            className="slide-track" 
            style={{ width: `calc(48px + ${dragProgress * 100}%)` }} 
          />
          <div className="slide-text">{t('projects.openProject')}</div>
          <button
            type="button"
            className="slide-thumb" 
            ref={thumbRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProject();
              }
            }}
            aria-label={`${t('projects.openProject')}: ${project.h3}`}
          >
            ❯
          </button>
        </div>
        ) : (
          <p className="project-link-coming-soon">{t('projects.linkComingSoon')}</p>
        )}
      </div>
    </div>
  );
}

export default ProjectModal;
