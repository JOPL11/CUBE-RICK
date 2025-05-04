'use client'
import { useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import VideoGammaMaterial from './VideoGammaMaterial'
import { gsap } from 'gsap'

const WIDE_CUBE_WIDTH = 6.2 // 3 cubes wide + spacing

export default function WideCube({
  position = [0, 0, 0],
  height = 0.5,
  depth = 2,
  onClick,
  color = "#3d3d3d",
  logo = null,
  videoUrl = null
}) {
  const groupRef = useRef()
  const [videoElement, setVideoElement] = useState(null)

  // Video element creation with delay
  useEffect(() => {
    if (!videoUrl) {
      setVideoElement(null)
      return
    }

    const timeoutId = setTimeout(() => {
      const vid = document.createElement('video')
      vid.src = videoUrl
      vid.crossOrigin = 'anonymous'
      vid.loop = true
      vid.muted = true
      vid.playsInline = true
      vid.autoplay = true
      vid.setAttribute('webkit-playsinline', 'webkit-playsinline')
      setVideoElement(vid)
      vid.play().catch(console.error)
    }, 1200) // 1.2s delay

    return () => {
      clearTimeout(timeoutId)
      if (videoElement) {
        videoElement.pause()
        videoElement.removeAttribute('src')
        videoElement.load()
      }
    }
  }, [videoUrl])

  const handlePointerEnter = () => {
    gsap.to(groupRef.current.position, {
      y: position[1] + 0.25,
      duration: 0.5,
      ease: "power2.out"
    })
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    gsap.to(groupRef.current.position, {
      y: position[1],
      duration: 0.5,
      ease: "power2.out"
    })
    document.body.style.cursor = 'auto'
  }

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
    >
      {/* Main cube */}
      <mesh castShadow>
        <boxGeometry args={[WIDE_CUBE_WIDTH, height, depth]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>

      {/* Video or color plane on top */}
      <mesh position={[0, height/2 + 0.001, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[WIDE_CUBE_WIDTH, depth]} />
        {videoElement ? (
          <VideoGammaMaterial map={new THREE.VideoTexture(videoElement)} />
        ) : (
          <meshStandardMaterial color={color} />
        )}
      </mesh>

      {/* Logo */}
      {logo && (
        <mesh position={[-WIDE_CUBE_WIDTH/2 + 0.33, height/2 + 0.01, depth/2 - 0.33]} 
              rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[0.33, 0.33 * (logo.image.height / logo.image.width)]} />
          <meshStandardMaterial 
            map={logo}
            transparent={true}
            alphaTest={0.5}
          />
        </mesh>
      )}
    </group>
  )
}