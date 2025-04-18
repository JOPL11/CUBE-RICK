'use client'
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const RedDotStealth = ({ onEngage }) => {
  const dotRef = useRef();

  useFrame(() => {
    // Direct mutation for better performance
    dotRef.position.x += speed * Math.sin(dotRef.rotation.y) * deltaTime;
    dotRef.position.z += speed * Math.cos(dotRef.rotation.y) * deltaTime;
  });

  return (
    <mesh 
      ref={dotRef}
      onClick={onEngage}
      scale={1.5} // More visible size
    >
      <sphereGeometry args={[2.45, 32, 32]} /> {/* Smoother sphere */}
      <meshBasicMaterial 
        color="red" 
        transparent 
        opacity={0.9}
        toneMapped={false} // Brighter color
      />
    </mesh>
  );
};