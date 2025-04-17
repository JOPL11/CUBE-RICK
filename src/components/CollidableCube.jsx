import { useBox } from '@react-three/cannon';
import { Float } from '@react-three/drei';

// 1. Main physics cube component (used by BOTH systems)
export function PhysicsCube({ position, size, color }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
    userData: { isDecorCube: true }
  }));

  return (
    <Float speed={1 + Math.random() * 2} rotationIntensity={0.2}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
}

// 2. Decorative cubes generator (exported!)
export function DecorativeCubes() {
  const positions = Array.from({ length: 20 }, () => {
    let x, z;
    do {
      x = (Math.random() - 0.5) * 15;
      z = (Math.random() - 0.5) * 15;
    } while (Math.abs(x) < 4 && Math.abs(z) < 4);

    return [x, 0.01, z];
  });

  return (
    <>
      {positions.map((pos, i) => (
        <PhysicsCube 
          key={`decor-${i}`}
          position={pos}
          size={[0.3, 0.3, 0.3]}
          color={i % 2 === 0 ? "white" : "#3d3d3d"}
        />
      ))}
    </>
  );
}

// 3. Alias for consistency (optional)
export const CollidableCube = PhysicsCube;