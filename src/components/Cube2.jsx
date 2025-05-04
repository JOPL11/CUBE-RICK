'use client'
import { useRef, useState, useEffect } from 'react'
import { Text, RoundedBox } from '@react-three/drei'
import { gsap } from 'gsap'
import { useThree, useFrame } from '@react-three/fiber'
// Use Next.js's built-in font handling
const myFont2 = '/fonts/InterDisplay-Bold.ttf';
const myFont = '/fonts/InterDisplay-Regular.ttf';
import * as THREE from 'three'

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
   topLeftText = "TRUST THE FLOW", bottomRightText = "BE PRESENT", onClick, color, logo = null, cubeIndex = 0 }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const groupRef = useRef()
  const meshRef = useRef()
  const { camera } = useThree()
  const textGroupRef = useRef() // For controlling both text elements

  // Decide color internally if not provided
  const effectiveColor = color || getCubeColor(cubeIndex);
  
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
    e.stopPropagation() // Prevent event from bubbling to other cubes
    if (onClick) onClick(e)
  }

  // Offset to float text just above the cube
  const TEXT_Y_OFFSET = 0.02;

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
        radius={0.03} 
        smoothness={3} 
        castShadow
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
          position={[-0.8, CUBE_SIZE_Y / 2 + TEXT_Y_OFFSET, -0.8]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.18}
          color={effectiveColor === "white" ? "#15171b" : "white"}
          maxWidth={1.5}
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
          position={[0.8, CUBE_SIZE_Y / 2 + TEXT_Y_OFFSET, 0.65]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.13}
          color={effectiveColor === "white" ? "#15171b" : "white"}
          maxWidth={1.5}
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
  );
}