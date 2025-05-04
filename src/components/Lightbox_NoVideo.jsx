'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

// Reusable Lightbox component
export function ReusableLightbox({ content, onClose, isOpen }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: 'transparent',
        padding: '0',
        borderRadius: '8px',
        width: '100%',
        height: '100%',
        padding: '20px',
        border: '1px solid #ff0000',
        margin: '20px',
        overflow: 'hidden',
        position: 'relative',
        border: 'none'
      }}>
        {type === 'iframe' ? (
          <iframe
            src={content}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#ffffff'
            }}
          />
        ) : (
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            margin: 0,
            paddingBottom: '40px',
            overflowY: 'visible'
          }}>
            {content}
          </pre>
        )}
        <button 
          onClick={onClose}
          style={{
            position: 'sticky',
            bottom: '20px',
            left: '100%',
            transform: 'translateX(-100%)',
            background: '#343840',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '4px',
            marginTop: '20px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Original Lightbox component
export default function Lightbox({ content, type = 'image', isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [portalContainer, setPortalContainer] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const dragOffset = useRef(0)
  const galleryRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Create portal container
    const container = document.createElement('div')
    container.id = 'lightbox-portal'
    document.body.appendChild(container)
    setPortalContainer(container)

    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container)
      }
      setPortalContainer(null)
    }
  }, [isOpen])

  const handleKeyPress = useCallback((e) => {
    if (!isOpen) return
    if (e.key === 'Escape') onClose()
  }, [isOpen, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const snapToImage = (index) => {
    if (!galleryRef.current) return
    const newIndex = Math.max(0, Math.min(index, media.length - 1))
    setCurrentIndex(newIndex)
    const offset = -newIndex * 90 // Use vw units to match the container width
    galleryRef.current.style.transform = `translateX(${offset}vw)`
    galleryRef.current.style.transition = 'transform 0.3s ease-out'
    setTimeout(() => {
      if (galleryRef.current) {
        galleryRef.current.style.transition = 'none'
      }
    }, 300)
  }

  const handleDragStart = (e) => {
    if (!Array.isArray(media) || !galleryRef.current) return
    setIsDragging(true)
    dragStart.current = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
    dragOffset.current = -currentIndex * 90 // Use vw units
    galleryRef.current.style.transition = 'none'
    if (e.type === 'mousedown') e.preventDefault()
  }

  const handleDragMove = (e) => {
    if (!isDragging || !galleryRef.current) return
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
    const diff = currentX - dragStart.current
    const newOffset = dragOffset.current + (diff * 100 / window.innerWidth) // Convert pixels to vw
    galleryRef.current.style.transform = `translateX(${newOffset}vw)`
    if (e.type === 'mousemove') e.preventDefault()
  }

  const handleDragEnd = () => {
    if (!isDragging || !galleryRef.current) return
    setIsDragging(false)
    
    const matrix = new DOMMatrix(getComputedStyle(galleryRef.current).transform)
    const currentOffsetVw = (matrix.m41 * 100) / window.innerWidth // Convert pixels to vw
    const startOffsetVw = -currentIndex * 90
    const diffVw = currentOffsetVw - startOffsetVw
    
    // Snap to next image if dragged more than 15vw (approximately 30px on most screens)
    if (Math.abs(diffVw) > 15) {
      const direction = diffVw > 0 ? -1 : 1
      snapToImage(currentIndex + direction)
    } else {
      snapToImage(currentIndex)
    }
  }

  if (!isOpen || !portalContainer) return null;

  // --- HTML overlay support ---
  if (type === 'iframe' && content) {
    return createPortal(
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 18, right: 18, zIndex: 10001,
          background: '#222', color: '#fff',
          border: 'none', borderRadius: '50%', width: 38, height: 38,
          fontSize: 22, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
        }}>✖</button>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          borderRadius: 8,
          boxSizing: 'border-box',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <iframe
            src={content}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 8,
              background: '#fff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              margin: '20px'
            }}
            title="External Page"
          />
        </div>
      </div>,
      portalContainer
    );
  }

  const renderMedia = () => {
    const currentMedia = Array.isArray(media) ? media[currentIndex] : media

    if (type === 'video') {
      return (
        <div style={{ 
          width: '100%',
          height: '100%',
          padding: '20px',
        border: '1px solid #ff0000', 
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
          <video 
            controls 
            autoPlay 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain',
              background: 'black',
            }}
          >
            <source src={currentMedia} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (Array.isArray(media)) {
      return (
        <div 
          style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            ref={galleryRef}
            style={{
              display: 'flex',
              position: 'absolute',
              height: '100%',
              width: `${media.length * 90}vw`, // Set total width
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: `translateX(${-currentIndex * 90}vw)`,
              willChange: 'transform',
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {media.map((src, index) => (
              <div
                key={index}
                style={{
                  width: '90vw',
                  height: '100%',
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <img 
                  src={src} 
                  alt={`Gallery image ${index + 1}`}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <img 
        src={currentMedia} 
        alt="Lightbox content"
        style={{ 
          maxWidth: '90vw', 
          maxHeight: '80vh', 
          objectFit: 'contain',
        }}
      />
    )
  }
  const lightboxContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2400,
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {renderMedia()}
      </div>
      
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          padding: '10px',
          zIndex: 2401,
        }}
      >
        ✖
      </button>
    </div>
  )

  return createPortal(lightboxContent, portalContainer)
}
