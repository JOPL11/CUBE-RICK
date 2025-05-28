'use client'
import { useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'

export default function CameraAnimation({ controlsRef, onComplete, setVideoPaused, isMobile }) {
  const { camera } = useThree()
  const initTimeout = useRef(null)
  
  useEffect(() => {
    const initAnimation = () => {
      const currentControls = controlsRef?.current
      
      if (!camera || !currentControls) {
        // Retry after a short delay if not ready
        initTimeout.current = setTimeout(initAnimation, 100)
        return
      }

      // Clear any pending retries
      clearTimeout(initTimeout.current)
      
      setVideoPaused?.(true)
      
      if (isMobile) {
        // Mobile setup
        camera.position.set(0, 15, 0.1)
        camera.lookAt(0, 0, 0)
        currentControls.enabled = false
        currentControls.target.set(0, 0, 0)
        
        if ('minPolarAngle' in currentControls) {
          currentControls.minPolarAngle = Math.PI/2 - 0.01
          currentControls.maxPolarAngle = Math.PI/2 + 0.01
        }
        
        currentControls.update()
        onComplete?.()
        setVideoPaused?.(false)
      } else {
        // Desktop animation
        camera.position.set(5, 1.5, -10)
        currentControls.target.set(0, 0, 0)
        currentControls.update()

        const animationRef = gsap.to({
          progress: 0,
          angle: Math.PI/2,
          height: 2,
          tilt: 0
        }, {
          progress: 1,
          angle: 0,
          height: 11,
          tilt: 0,
          duration: 6,
          ease: "power2.inOut",
          onUpdate: function() {
            const t = this.targets()[0].progress;
            const orbitX = Math.sin(this.targets()[0].angle) * 15;
            const orbitZ = Math.cos(this.targets()[0].angle) * 15;
            const orbitY = this.targets()[0].height;
            
            camera.position.x = THREE.MathUtils.lerp(orbitX, 0, t);
            camera.position.y = THREE.MathUtils.lerp(orbitY, 11, t);
            camera.position.z = THREE.MathUtils.lerp(orbitZ, 7, t);
            
            const target = new THREE.Vector3(0, 0, 0);
            camera.lookAt(target);
            camera.rotateX(this.targets()[0].tilt);
            
            currentControls.target.copy(target);
            currentControls.update();
          },
          onComplete: () => {
            currentControls.enabled = true;
            if ('minPolarAngle' in currentControls) {
              currentControls.minPolarAngle = 0;
              currentControls.maxPolarAngle = Math.PI;
            }
            onComplete?.();
            setVideoPaused?.(false);
          }
        })

        return () => animationRef?.kill()
      }
    }

    initAnimation()

    return () => {
      clearTimeout(initTimeout.current)
      setVideoPaused?.(false)
    }
  }, [camera, controlsRef, onComplete, setVideoPaused, isMobile])

  return null
}