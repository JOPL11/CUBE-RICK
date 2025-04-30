'use client'

import { Float } from '@react-three/drei'

const DecorativeCubes = () => {
  const numCubes = 20
  const positions = Array.from({ length: numCubes }, () => {
    // Generate position with exclusion zone
    let x, z
    do {
      x = (Math.random() - 0.5) * 15
      z = (Math.random() - 0.5) * 15
    } while (
      // Exclude the area around the main cubes (approximately -4 to 4 in x and z)
      (Math.abs(x) < 4 && Math.abs(z) < 4)
    )

    return {
      x,
      y: 0.01, // ADJUST THIS VALUE TO CHANGE CUBE HEIGHT: lower number = closer to ground
      z
    }
  })

  return (
    <>
      {positions.map((pos, i) => (
        <Float 
          key={i}
          speed={1 + Math.random() * 2}
          rotationIntensity={0.2}
          floatIntensity={0.1}
        >
          <mesh position={[pos.x, pos.y, pos.z]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={i % 2 === 0 ? "white" : "#1a1a1a"} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export default DecorativeCubes