'use client'
import { useRef, useState, useEffect } from 'react'
import { Text, RoundedBox } from '@react-three/drei'
import { gsap } from 'gsap'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Cube dimensions
const CUBE_SIZE_X = 2
const CUBE_SIZE_Y = 0.5
const CUBE_SIZE_Z = 2

export default function Cube({
  position = [0, 0.88, 0],
  topLeftText = "TRUST THE FLOW",
  bottomRightText = "BE PRESENT",
  onClick,
  color,
  logo = null,
  cubeIndex = 0,
  description
}) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const groupRef = useRef()
  const meshRef = useRef()
  const { camera } = useThree()
  const textGroupRef = useRef()
  const tlTextRef = useRef()
  const brTextRef = useRef()

  const effectiveColor = color || (cubeIndex % 2 === 0 ? "white" : "#3d3d3d")
  const TEXT_Y_OFFSET = 0.02

  // Font preloading for Umlauts
  useEffect(() => {
    const preload = document.createElement('div')
    preload.style.position = 'absolute'
    preload.style.left = '-9999px'
    preload.style.fontFamily = 'InterDisplay-Bold, InterDisplay-Regular'
    preload.textContent = 'äöüßÄÖÜ'
    document.body.appendChild(preload)
    
    return () => document.body.removeChild(preload)
  }, [])

  const handleMountComplete = () => {
    setIsMounted(true)
  }

  // Initial mount animation
  useEffect(() => {
    if (!tlTextRef.current || !brTextRef.current) return

    gsap.set([tlTextRef.current, brTextRef.current], {
      opacity: 0,
      y: 20
    })

    const tl = gsap.timeline()
    tl.to({}, { duration: 5 })
      .to([tlTextRef.current, brTextRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        onComplete: handleMountComplete // Using the mount complete handler
      })

    return () => tl.kill()
  }, [])

  // Text change animation
  useEffect(() => {
    if (!isMounted || !tlTextRef.current || !brTextRef.current) return

    gsap.fromTo([tlTextRef.current, brTextRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1
      }
    )
  }, [topLeftText, bottomRightText, isMounted])

  // Initial mount animation with delay
  useEffect(() => {
    if (!tlTextRef.current || !brTextRef.current || !fontLoaded) return;
    
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
  }, [fontLoaded]);

  // Text change animation - only runs if mount animation is complete
  useEffect(() => {
    if (!isMounted || !tlTextRef.current || !brTextRef.current || !fontLoaded) return;
    
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
  }, [topLeftText, bottomRightText, isMounted, fontLoaded]);

  useFrame(() => {
    if (!textGroupRef.current) return;
  
    // 1. Get camera direction vector
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
  
    // 2. Calculate yaw angle (top-down rotation)
    const yaw = Math.atan2(cameraDirection.x, cameraDirection.z); // -π to π
  
    // 3. Snap yaw to nearest 90°
    const snapYaw = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2);

    // 4. Set text rotation so it remains upright relative to the grid (world axes)
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


  if (!isInitialized || !fontLoaded) return null;
 //if (!fontsReady) return null // Or a loading state

  return (
    <group
      ref={groupRef}
      position={position}
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
        <Text
          ref={tlTextRef}
          position={[-0.8, CUBE_SIZE_Y / 2 + TEXT_Y_OFFSET, -0.8]}
          fontSize={0.18}
          color={effectiveColor === "white" ? "#15171b" : "white"}
          maxWidth={1.5}
          lineHeight={1.2}
          font="InterDisplay-Bold"
          anchorX="left"
          anchorY="top"
        >
          {topLeftText}
        </Text>

        <Text
          ref={brTextRef}
          position={[0.8, CUBE_SIZE_Y / 2 + TEXT_Y_OFFSET, 0.65]}
          fontSize={0.13}
          color={effectiveColor === "white" ? "#15171b" : "white"}
          maxWidth={1.5}
          font="InterDisplay-Regular"
          anchorX="right"
          anchorY="top"
        >
          {bottomRightText}
        </Text>
      </group>

      {logo && (
        <mesh position={[-0.65, CUBE_SIZE_Y / 2 + 0.01, 0.72]} rotation={[-Math.PI/2, 0, 0]}>
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