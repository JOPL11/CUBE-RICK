import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const RedDot = forwardRef(({ onClick, interactive = true }, ref) => {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const target = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 8,
    3.1 + Math.random(),
    (Math.random() - 0.5) * 8
  ))
  const speed = useRef(0.02)
  const tweenRef = useRef(null)

  // Expose dot controls to parent
  useImperativeHandle(ref, () => ({
    get position() {
      return meshRef.current?.position.clone() || new THREE.Vector3()
    },
    get target() {
      return target.current.clone()
    },
    teleportTo(position) {
      if (meshRef.current) {
        meshRef.current.position.copy(position)
        target.current.copy(position)
      }
    }
  }))

  // Erratic movement with GSAP
  useEffect(() => {
    const randomizeTarget = () => {
      const newTarget = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        0.9 + Math.random(),
        (Math.random() - 0.5) * 8
      )
      speed.current = 0.01 + Math.random() * 0.03
      
      if (tweenRef.current) tweenRef.current.kill()
      
      tweenRef.current = gsap.to(target.current, {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
        duration: 2 + Math.random() * 3,
        ease: "sine.inOut",
        onComplete: randomizeTarget
      })
    }

    randomizeTarget()
    return () => tweenRef.current?.kill()
  }, [])

  // Hover effects
  useFrame(() => {
    if (!meshRef.current) return
    
    // Movement
    meshRef.current.position.lerp(target.current, speed.current)
    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.004
    
    // Scale animation
    const targetScale = hovered ? 1.5 : 1
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })

  return (
    <Float speed={0.5} floatIntensity={0.7}>
      <mesh 
        ref={meshRef}
        onClick={interactive ? onClick : undefined}
        onPointerOver={interactive ? () => {
          document.body.style.cursor = 'pointer'
          setHover(true)
        } : undefined}
        onPointerOut={interactive ? () => {
          document.body.style.cursor = 'auto'
          setHover(false)
        } : undefined}
        castShadow
      >
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#ff5555" : "red"}
          emissive={hovered ? "#ff2222" : "#ff0000"}
          emissiveIntensity={hovered ? 2.5 : 1.5}
          transparent
          opacity={hovered ? 0.9 : 0.8}
        />
      </mesh>
    </Float>
  )
})

export default RedDot