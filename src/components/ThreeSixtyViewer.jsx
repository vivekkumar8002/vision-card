import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function ThreeSixtyViewer({ images = [], autoRotate = false, rotationSpeed = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  const totalFrames = images.length;

  // Handle auto-rotation
  useEffect(() => {
    if (autoRotate && totalFrames > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }, 100 / rotationSpeed);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [autoRotate, totalFrames, rotationSpeed]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    const diff = currentX - startX;
    const sensitivity = 10; // pixels per frame
    
    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1;
      setCurrentIndex((prev) => {
        let newIndex = prev + direction;
        if (newIndex < 0) newIndex = totalFrames - 1;
        if (newIndex >= totalFrames) newIndex = 0;
        return newIndex;
      });
      setStartX(currentX);
    }
  }, [isDragging, startX, totalFrames]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleMouseDown);
    
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleMouseDown);
    };
  }, [handleMouseDown]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="three-sixty-viewer"
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <div className="three-sixty-viewer__container">
        <img
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1} of ${totalFrames}`}
          className="three-sixty-viewer__image"
          draggable={false}
        />
      </div>
      
      {totalFrames > 1 && (
        <div className="three-sixty-viewer__controls">
          <div className="three-sixty-viewer__hint">
            <span className="three-sixty-viewer__drag-icon">⟲</span>
            <span>Drag to rotate</span>
          </div>
          <div className="three-sixty-viewer__progress">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`three-sixty-viewer__dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View angle ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ThreeSixtyViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  autoRotate: PropTypes.bool,
  rotationSpeed: PropTypes.number,
};

ThreeSixtyViewer.defaultProps = {
  images: [],
  autoRotate: false,
  rotationSpeed: 1,
};

export default ThreeSixtyViewer;
