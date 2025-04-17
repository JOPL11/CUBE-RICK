'use client'
import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { gsap } from 'gsap'
import myFont2 from '/public/fonts/InterDisplay-Bold.ttf';
import myFont from '/public/fonts/InterDisplay-Regular.ttf';




export default function Cube({ topLeftText = "TRUST THE FLOW", bottomRightText = "BE PRESENT", onClick, color = "white", logo = null }) {
  const groupRef = useRef() // This will parent both cube and text
  const meshRef = useRef() // Separate ref for the cube mesh

  const handlePointerEnter = (e) => {
    e.stopPropagation() // Prevent event from bubbling to other cubes
    gsap.to(groupRef.current.position, {
      y: 0.25,
      duration: 0.5,
      ease: "power2.out"
    })
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = (e) => {
    e.stopPropagation() // Prevent event from bubbling to other cubes
    gsap.to(groupRef.current.position, {
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    })
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e) => {
    e.stopPropagation() // Prevent event from bubbling to other cubes
    if (onClick) onClick(e)
  }

  return (
    <group 
      ref={groupRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Cube mesh with its own ref */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={color}
        />
      </mesh>
      {/* Logo plane on top face */}
      {logo && (
        <mesh position={[-0.65, 1.01, 0.72]} rotation={[-Math.PI/2, 0, 0]}>
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
      <Text
        position={[-0.8, 1.02, -0.8]} // Top left corner of the cube's top face
        rotation={[-Math.PI/2, 0, 0]} // Rotated to lie flat
        fontSize={0.15}
        color={color === "white" ? "#15171b" : "white"}
        maxWidth={1.5}
        lineHeight={1.2}
        font={myFont2}
        anchorX="left"
        anchorY="top"
        material-toneMapped={false} // Ensures it doesn't dim with lighting
        material-depthTest={false} // Always renders in front
        material-side={0} // Ensure only the front side is rendered
      >
        {topLeftText}
      </Text>
      <Text
        position={[0.8, 1.02, 0.8]} // Bottom right corner of the cube's top face
        rotation={[-Math.PI/2, 0, 0]} // Rotated to lie flat
        fontSize={0.09}
        color={color === "white" ? "#15171b" : "white"}
        maxWidth={1.5}
        lineHeight={1.2}
        font={myFont}
        anchorX="right"
        anchorY="bottom"
        material-toneMapped={false}
        material-depthTest={false}
        material-side={0}
      >
        {bottomRightText}
      </Text>
    </group>
  )
}