import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const RedDotShip = ({ onClick }) => {
  const dotRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const speed = 0.02;

  // Random movement
  useFrame(() => {
    const newPos = [
      position[0] + (Math.random() - 0.5) * speed,
      position[1] + (Math.random() - 0.5) * speed,
      position[2] + (Math.random() - 0.5) * speed
    ];
    setPosition(newPos);
    dotRef.current.position.set(...newPos);
  });

  return (
    <mesh 
      ref={dotRef} 
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.1, 16, 16]} />  {/* Small red dot */}
      <meshBasicMaterial color="red" />
    </mesh>
  );
};