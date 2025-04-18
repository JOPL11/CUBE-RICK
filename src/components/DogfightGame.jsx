'use client'
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export const DogfightGame = ({ onExit }) => {
  const shipRef = useRef();

  useFrame(({ clock }) => {
    // More dynamic movement
    const time = clock.getElapsedTime();
    shipRef.current.rotation.x = Math.sin(time) * 0.3;
    shipRef.current.rotation.y = Math.cos(time * 0.7) * 0.2;
    shipRef.current.position.y = Math.sin(time * 2) * 0.1;
  });

  return (
    <group>
      <mesh ref={shipRef}>
        <boxGeometry args={[0.5, 0.2, 1]} /> {/* More ship-like proportions */}
        <meshStandardMaterial 
          color="red" 
          emissive="red" 
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <Html center>
        <button 
          onClick={onExit}
          style={{
            background: 'rgba(255,0,0,0.5)',
            border: '2px solid red',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
        >
          ABORT MISSION
        </button>
      </Html>
    </group>
  );
};