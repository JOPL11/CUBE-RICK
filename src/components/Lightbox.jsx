'use client'
import { useEffect, useState, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({ isOpen, onClose, content }) {
  const [portalContainer, setPortalContainer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef(null)
  const iframeRef = useRef(null)
  const overlayRef = useRef(null)

   // Add loading state management
   useEffect(() => {
    setIsLoading(true)
    // Simulate or actual content loading logic
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [content])


  useEffect(() => {
    if (!isOpen) return
    
    const container = document.createElement('div')
    document.body.appendChild(container)
    setPortalContainer(container)
    
    return () => {
      document.body.removeChild(container)
    }
  }, [isOpen])

    // Add video autoplay and mobile handling
    useEffect(() => {
      if (!isOpen || !videoRef.current) return
  
      const videoElement = videoRef.current
      
      // Attempt to play video with various mobile-friendly approaches
      const playVideo = async () => {
        try {
          // Muted autoplay is more likely to work on mobile
          videoElement.muted = true
          videoElement.autoplay = true
          
          // Attempt different play methods
          await videoElement.play()
        } catch (error) {
          console.warn('Autoplay failed:', error)
          // Fallback: remove mute and try again
          videoElement.muted = false
          try {
            await videoElement.play()
          } catch (fallbackError) {
            console.error('Video play failed:', fallbackError)
          }
        }
      }
  
      playVideo()
    }, [isOpen])

  // Double security - block all pointer events except for the iframe
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return
    
    const handlePointerDown = (e) => {
      const isVideoControlTarget = 
      videoRef.current?.contains(e.target) && 
      (e.target.tagName === 'VIDEO' || 
       e.target.closest('.video-controls') || 
       e.target.matches('input[type="range"]'))

    if (!iframeRef.current?.contains(e.target) && 
        !isVideoControlTarget && 
        !e.target.closest('button')) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

    overlayRef.current.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      overlayRef.current?.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [isOpen])

  if (!isOpen || !portalContainer) return null

   // Determine content type and render accordingly
   const renderContent = () => {
    // Check if content is a video URL
    const isVideoContent = content.match(/\.(mp4|webm|ogg)$/i)
    
    if (isVideoContent) {
      return (
        <video
          ref={videoRef}
          src={content}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
          playsInline
          controls
          className="no-volume-control"
        />
      )
    }
    
    // Fallback to iframe for non-video content
    return (
      <iframe
        ref={iframeRef}
        src={content}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'auto',
          borderRadius: '8px'
        }}
        allow="autoplay; pointer-events"
      />
    )
  }

  return createPortal(
<div 
  ref={overlayRef}
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    zIndex: 999999, // Very high z-index to ensure it's on top
    pointerEvents: 'auto' // Let the container handle all events
  }}
>
  {/* Backdrop - same as before */}
  <div 
    onClick={onClose}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: '8px',
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(5px)',
      pointerEvents: 'auto'
    }}
  />
  
  {/* Simplified content area */}
  <div id="main-content-container" style={{
    position: 'relative',
    width: '90%',
    height: '90%',
    maxWidth: '1800px',
    maxHeight: '90vh',
    pointerEvents: 'none' // Container won't block by default
  }}>
    <iframe
      ref={iframeRef}
      src={content}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'auto', // Only the iframe is interactive
        borderRadius: '8px'
      }}
      allow="pointer-events"
    />
    
    <button
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        background: 'rgba(0,0,0,0.5)',
        border: 'none',
        color: 'white',
        fontSize: '28px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        pointerEvents: 'auto',
        zIndex: 3
      }}
    >
      ×
    </button>
  </div>
</div>,
    portalContainer
  )
}