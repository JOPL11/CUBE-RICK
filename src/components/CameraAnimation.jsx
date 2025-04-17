'use client'
import { useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function CameraAnimation({ controlsRef }) {
    const { camera } = useThree()
    const animationRef = useRef()
  
    useEffect(() => {
      if (!controlsRef.current) return
  
      // Set initial camera position
      camera.position.set(-10, 0, -15)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
  
      // Create animation
      animationRef.current = gsap.to({ 
        angle: Math.PI * 1.75,
        height: 0 // Starting height
      }, {
        angle: Math.PI * 0.5,
        height: 8, // Target height
        duration: 6,
        ease: "sine.inOut",
        delay: 1.5,
        onUpdate: function() {
          const radius = 8
          const angle = this.targets()[0].angle
          const height = this.targets()[0].height
          
          // Spiral motion calculation
          camera.position.x = Math.cos(angle) * radius
          camera.position.z = Math.sin(angle) * radius
          camera.position.y = height // Animate y position
          
          controlsRef.current.update()
        },
        onStart: () => controlsRef.current.enabled = false,
        onComplete: () => controlsRef.current.enabled = true
      })
  
      return () => {
        if (animationRef.current) {
          animationRef.current.kill()
        }
      }
    }, [camera, controlsRef])
  
    return null
}