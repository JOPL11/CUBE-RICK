import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSphere } from '@react-three/cannon';

export default function RedDot({ onClick }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3());
  
  // Physics setup
  const [physicsRef, api] = useSphere(() => ({
    mass: 1,
    args: [0.05], // Match your sphereGeometry size
    position: [5, 3, 0], // Starting position
    linearDamping: 0.8, // Controls how quickly it slows down
  }));

  // Combine refs for both physics and mesh
  const ref = useRef();
  useEffect(() => {
    if (meshRef.current && physicsRef.current) {
      ref.current = physicsRef.current;
      meshRef.current.position.copy(physicsRef.current.position);
    }
  }, []);

  // Random movement target
  const target = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 8,
    1.1 + Math.random(),
    (Math.random() - 0.5) * 8
  ));
  const speed = useRef(0.02);

  // Update movement target periodically
  useEffect(() => {
    const interval = setInterval(() => {
      target.current.set(
        (Math.random() - 0.5) * 8,
        1.1 + Math.random() * 2, // Slightly more vertical range
        (Math.random() - 0.5) * 8
      );
      speed.current = 0.01 + Math.random() * 0.03;
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Movement and physics update
  useFrame(() => {
    if (ref.current && meshRef.current) {
      // Update position for camera tracking
      setPosition(meshRef.current.position.clone());
      
      // Apply gentle force toward target
      const direction = new THREE.Vector3()
        .subVectors(target.current, meshRef.current.position)
        .normalize()
        .multiplyScalar(speed.current);
      
      api.applyForce([direction.x, direction.y, direction.z], [0, 0, 0]);

      // Hover effects
      meshRef.current.scale.lerp(
        new THREE.Vector3(hovered ? 1.5 : 1, hovered ? 1.5 : 1, hovered ? 1.5 : 1),
        0.1
      );
    }
  });

  return (
    <Float speed={0.9} floatIntensity={0.8}>
      <mesh 
        ref={meshRef}
        onClick={() => onClick(position)}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setHover(false);
        }}
        castShadow
      >
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#ff5555" : "red"} 
          emissive={hovered ? "#ff2222" : "#ff0000"}
          emissiveIntensity={hovered ? 2.5 : 1.5}
          transparent
          opacity={hovered ? 0.9 : 0.8}
        />
      </mesh>
    </Float>
  );
}