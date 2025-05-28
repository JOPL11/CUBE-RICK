'use client'
import { useRef, useState, useEffect } from 'react'
import { Text } from '@react-three/drei'
import { gsap } from 'gsap'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import VideoGammaMaterial from './VideoGammaMaterial';

// Offset to float text just above the cube

const WIDE_CUBE_WIDTH = 2 * 3 + 0.2; // width stays fixed at 3 cubes

export default function WideCube({ position = [0, 0, 0], height = 0.5, depth = 2, topLeftText = "HEADER", 
  bottomRightText = "VISUALS", onClick, color = "white", logo = null, videoUrl = null }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const groupRef = useRef()
  const meshRef = useRef()
  const { camera } = useThree()
  const textGroupRef = useRef()

  // --- Video element creation with delay ---
  const [videoElement, setVideoElement] = useState(null);
  useEffect(() => {
    let timeoutId;
    if (videoUrl) {
      timeoutId = setTimeout(() => {
        const vid = document.createElement('video');
        vid.src = videoUrl;
        vid.crossOrigin = 'anonymous';
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.setAttribute('webkit-playsinline', 'webkit-playsinline');
        setVideoElement(vid);
        vid.play().catch(() => {});
      }, 7200); // 1.2s delay
    } else {
      setVideoElement(null);
    }
    return () => clearTimeout(timeoutId);
  }, [videoUrl]);

  useFrame(() => {
    if (!textGroupRef.current) return;
    // Camera-aware text rotation (same as Cube)
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const yaw = Math.atan2(cameraDirection.x, cameraDirection.z);
    const snapYaw = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2);
    gsap.to(textGroupRef.current.rotation, {
      y: 0,
      x: 0,
      duration: 0.1,
      overwrite: true
    });
  });

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized) return null;

  const handlePointerEnter = (e) => {
    e.stopPropagation()
    gsap.to(groupRef.current.position, {
      y: position[1] + 0.25,
      duration: 0.5,
      ease: "power2.out"
    })
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = (e) => {
    e.stopPropagation()
    gsap.to(groupRef.current.position, {
      y: position[1],
      duration: 0.5,
      ease: "power2.out"
    })
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick(e)
  }

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0,0,0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[WIDE_CUBE_WIDTH, height, depth]} />
        <meshStandardMaterial 
         // color={color}
         color="#3d3d3d" 
          metalness={0.1}
          roughness={0.3}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Video-textured plane above the top face */}
      {videoElement && (
        <mesh position={[0, height / 2 + TEXT_Y_OFFSET, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[WIDE_CUBE_WIDTH, depth]} />
          <VideoGammaMaterial map={new THREE.VideoTexture(videoElement)} gamma={1.8} />
        </mesh>
      )}
      {/* Purple fallback if no videoUrl */}
      {!videoUrl && (
        <mesh position={[0, height / 2 + TEXT_Y_OFFSET, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[WIDE_CUBE_WIDTH, depth]} />
          <meshStandardMaterial color="#3d3d3d" />
        </mesh>
      )}
      <group ref={textGroupRef}>
        <Text
          position={[-WIDE_CUBE_WIDTH/2 + 0.18, height / 2 + TEXT_Y_OFFSET, -depth/2 + 0.18]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.18}
          color={color === "white" ? "#15171b" : "white"}
          maxWidth={2.5}
          lineHeight={1.2}
          font={myFont2}
          anchorX="left"
          anchorY="top"
          renderOrder={1}
          material-toneMapped={false} 
          material-depthWrite={true}
          material-depthTest={true}
          material-side={0}
        >
          {topLeftText}
        </Text>
        <Text
          position={[WIDE_CUBE_WIDTH/2 - 0.18, height / 2 + TEXT_Y_OFFSET, depth/2 - 0.18]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.13}
          color={color === "white" ? "#15171b" : "white"}
          maxWidth={2.5}
          lineHeight={1.2}
          font={myFont}
          anchorX="right"
          anchorY="top"
          renderOrder={1}
          material-toneMapped={false} 
          material-depthWrite={true}
          material-depthTest={true}
          material-side={0}
        >
          {bottomRightText}
        </Text>
      </group>
      {logo && (
        <mesh position={[-WIDE_CUBE_WIDTH/2 + 0.33, height / 2 + 0.01, depth/2 - 0.33]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[0.33, 0.33 * (logo.image.height / logo.image.width)]} />
          <meshStandardMaterial 
            map={logo}
            transparent={true}
            alphaTest={0.5}
            depthWrite={true}
            depthTest={true}
            polygonOffset={true}
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}
    </group>
  );
}
