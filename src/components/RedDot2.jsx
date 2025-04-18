import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function RedDot({ onClick }) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const target = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 8,
    5.1 + Math.random(),
    (Math.random() - 0.5) * 8
  ));
  const speed = useRef(0.02);
  const tweenRef = useRef(null);

  // Erratic course changes with GSAP
  useEffect(() => {
    const randomizeTarget = () => {
      const newTarget = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        3.3 + Math.random(),
        (Math.random() - 0.5) * 8
      );
      speed.current = 0.01 + Math.random() * 0.03;
      
      if (tweenRef.current) tweenRef.current.kill();
      
      tweenRef.current = gsap.to(target.current, {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
        duration: 2 + Math.random() * 3,
        ease: "sine.inOut",
        onComplete: randomizeTarget
      });
    };

    randomizeTarget();

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  // Hover effects with GSAP
  useEffect(() => {
    if (!ref.current) return;
    
    if (hovered) {
      gsap.to(ref.current.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.3
      });
    } else {
      gsap.to(ref.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3
      });
    }
  }, [hovered]);

  // Movement
  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerp(target.current, speed.current);
      ref.current.rotation.x += 0.003;
      ref.current.rotation.y += 0.004;
    }
  });

  return (
    <Float speed={0.5} floatIntensity={0.7}>
      <mesh 
        ref={ref}
        onClick={onClick}
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
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial 
        castShadow
          color={hovered ? "#ff5555" : "red"}
          emissive={hovered ? "#ff2222" : "#ff0000"}
          emissiveIntensity={hovered ? 2.5 : 1.5}
          transparent
          opacity={hovered ? 1.0 : 1.0}
        />
      </mesh>
    </Float>
  );
}