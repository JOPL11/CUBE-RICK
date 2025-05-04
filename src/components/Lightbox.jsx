'use client'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({ isOpen, onClose, content }) {
  const [portalContainer, setPortalContainer] = useState(null)
  const iframeRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    
    const container = document.createElement('div')
    document.body.appendChild(container)
    setPortalContainer(container)
    
    return () => {
      document.body.removeChild(container)
    }
  }, [isOpen])

  // Double security - block all pointer events except for the iframe
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return
    
    const handlePointerDown = (e) => {
      // Only allow events that originate from the iframe
      if (!iframeRef.current?.contains(e.target)) {
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
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(5px)',
      pointerEvents: 'auto'
    }}
  />
  
  {/* Simplified content area */}
  <div style={{
    position: 'relative',
    width: '90%',
    height: '90%',
    maxWidth: '1200px',
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
      }}
      allow="pointer-events"
    />
    
    <button
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 20,
        right: 40,
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