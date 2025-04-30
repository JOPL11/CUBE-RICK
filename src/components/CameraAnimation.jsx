'use client'
import { useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'

export default function CameraAnimation({ controlsRef, onComplete, setVideoPaused }) {
  const { camera, scene } = useThree()
  
  useEffect(() => {
    console.log('CameraAnimation mounting', { camera, controls: controlsRef.current })
    const currentControls = controlsRef.current
    if (!camera || !currentControls) {
      console.error('Missing camera or controls')
      return
    }

    setVideoPaused?.(true)
    
    // Start higher and further back to ensure outside all cubes
    camera.position.set(5, 1.5, -10)
    currentControls.target.set(0, 0, 0)
    currentControls.update()

    const animationRef = gsap.to({
      progress: 0, // Tracks blend progress
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
        
        // Circular orbit position
        const orbitX = Math.sin(this.targets()[0].angle) * 15;
        const orbitZ = Math.cos(this.targets()[0].angle) * 15;
        const orbitY = this.targets()[0].height;
        
        // Final position (0,11,0)
        const finalX = 0;
        const finalY = 11;
        const finalZ = 7;
        
        // Blend between orbit and final position
        camera.position.x = THREE.MathUtils.lerp(orbitX, finalX, t);
        camera.position.y = THREE.MathUtils.lerp(orbitY, finalY, t);
        camera.position.z = THREE.MathUtils.lerp(orbitZ, finalZ, t);
        
        // Set lookAt target (center of scene)
        const target = new THREE.Vector3(0, 0, 0);
        camera.lookAt(target);
        
        // Apply additional tilt for birds-eye view
        camera.rotateX(this.targets()[0].tilt);
       
        // Update OrbitControls target
        currentControls.target.copy(target);
        currentControls.update();
      }, 
      onComplete: () => {
        currentControls.enabled = true;
        onComplete?.();
        setVideoPaused?.(false);
      }
    })

    return () => {
      console.log('CameraAnimation unmounting')
      animationRef?.kill()
      setVideoPaused?.(false)
    }
  }, [camera, onComplete, setVideoPaused])

  return null
}