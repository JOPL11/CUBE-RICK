'use client'

import * as THREE from 'three'
import { useRef, useEffect } from 'react'

export default function VideoPlane({ url }) {
  const meshRef = useRef()
  const videoRef = useRef(document.createElement('video'))
  
  useEffect(() => {
    const video = videoRef.current
    video.src = url
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Autoplay prevented:', err)
        document.addEventListener('click', () => video.play(), { once: true })
      })
    }
    
    return () => {
      video.pause()
      video.removeAttribute('src')
    }
  }, [url])
  
  return (
    <mesh 
      ref={meshRef}
      position={[0, 0, -5]}
    >
      <planeGeometry args={[4, 2.25]} />
      <meshBasicMaterial transparent opacity={0.9}>
        <videoTexture attach="map" args={[videoRef.current]} />
      </meshBasicMaterial>
    </mesh>
  )
}
