'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Text, RoundedBox, Html } from '@react-three/drei'
import { gsap } from 'gsap'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Use Next.js's built-in font handling
import { inter } from '@/app/fonts'

import TypewriterText from './TypewriterText';

// Cube dimensions
const CUBE_SIZE_X = 2;
const CUBE_SIZE_Y = 0.5;
const CUBE_SIZE_Z = 2;

// Centralized cube color logic
function getCubeColor(index) {
  // Example: alternate colors, or customize as needed
  return index % 2 === 0 ? "white" : "#3d3d3d";
}

export default function Cube({ position = [0, 0.88, 0],
   topLeftText = "TRUST THE FLOW", bottomRightText = "BE PRESENT", onClick, color, logo = null, cubeIndex = 0, description }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Track if the initial mount animation has completed
  const handleMountComplete = () => {
    setIsMounted(true);
  };
  const groupRef = useRef()
  const meshRef = useRef()
  const { camera } = useThree()
  const textGroupRef = useRef() // For controlling both text elements
  const tlTextRef = useRef(); // For top-left text
  const brTextRef = useRef(); // For bottom-right text
  
  // Decide color internally if not provided
  const effectiveColor = color || getCubeColor(cubeIndex);

  useEffect(() => {
    if (!tlTextRef.current || !brTextRef.current) return;
    
    // Clean up previous animations
    gsap.killTweensOf([tlTextRef.current, brTextRef.current]);
    
    // Animate in
    gsap.fromTo([tlTextRef.current, brTextRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      }
    );
  }, [topLeftText, bottomRightText]);

  // Initial mount animation with delay
  useEffect(() => {
    if (!tlTextRef.current || !brTextRef.current) return;
    
    // Set initial state to invisible
    gsap.set([tlTextRef.current, brTextRef.current], {
      opacity: 0,
      y: 20
    });

    // Create a timeline for the animation
    const tl = gsap.timeline();
    
    // Add a 5-second delay
    tl.to({}, { duration: 5 });
    
    // Then animate in
    tl.fromTo([tlTextRef.current, brTextRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      }
    ).then(handleMountComplete);

    return () => {
      tl.kill();
    };
  }, []);

  // Text change animation - only runs if mount animation is complete
  useEffect(() => {
    if (!isMounted || !tlTextRef.current || !brTextRef.current) return;
    
    // Clean up previous animations
    gsap.killTweensOf([tlTextRef.current, brTextRef.current]);
    
    // Animate in
    gsap.fromTo([tlTextRef.current, brTextRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      }
    );
  }, [topLeftText, bottomRightText, isMounted]);

  useFrame(() => {
    if (!textGroupRef.current) return;
  
    // 1. Get camera direction vector
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
  
    // 2. Calculate yaw angle (top-down rotation)
    const yaw = Math.atan2(cameraDirection.x, cameraDirection.z); // -¤Ç to ¤Ç
  
    // 3. Snap yaw to nearest 90┬░
    const snapYaw = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2);

    // 4. Set text rotation so it remains upright relative to the grid (world axes)
    // This means the text's world Y rotation should be 0, regardless of camera
    // So we counter-rotate by the camera's snapped yaw
    const textRotationY = 0;

    // Animate to new rotation (only if changed)
    gsap.to(textGroupRef.current.rotation, {
      y: textRotationY,
      x: 0,
      duration: 0.1,
      overwrite: true
    });
  });

  useEffect(() => {
    setIsInitialized(true);
  }, []);

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
    e.stopPropagation() // Prevent event from bubbling to other cubes
    if (onClick) onClick(e)
  }

  // Offset to float text just above the cube
  const TEXT_Y_OFFSET = 0.02;

  if (!isInitialized) return null;

  return (
   
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, 0, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <RoundedBox 
        ref={meshRef}
        args={[CUBE_SIZE_X, CUBE_SIZE_Y, CUBE_SIZE_Z]} 
        radius={0.05} 
        smoothness={2} 

      >
        <meshStandardMaterial 
          color={effectiveColor}
          metalness={0.1}
          roughness={0.3}
          emissiveIntensity={0.2}
        />
      </RoundedBox>
      <group ref={textGroupRef}>
        <TypewriterText 
          ref={tlTextRef}
          position={[-0.8, CUBE_SIZE_Y / 2 + TEXT_Y_OFFSET, -0.8]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.18}
          speed={30}
          color={effectiveColor === "white" ? "#15171b" : "white"}
          maxWidth={1.5}
          lineHeight={1.2}
          font={interBold.url}
          anchorX="left"
          anchorY="top"
        >
          {topLeftText}
        </TypewriterText>

        <TypewriterText
          ref={brTextRef}
          position={[0.8, CUBE_SIZE_Y / 2 + TEXT_Y_OFFSET, 0.65]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.13}
          color={effectiveColor === "white" ? "#15171b" : "white"}
          maxWidth={1.5}
          font={interRegular.url}
          anchorX="right"
          anchorY="top"
        >
          {bottomRightText}
        </TypewriterText>
      </group>
      {logo && (
        <mesh position={[-0.65, CUBE_SIZE_Y / 2 + 0.01, 0.72]} rotation={[-Math.PI/2, 0, 0]}>
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
  )
}
