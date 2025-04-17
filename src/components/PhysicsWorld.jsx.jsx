import { Physics } from '@react-three/cannon'
import { useMemo } from 'react'

export default function PhysicsWorld({ children }) {
  // Optimize physics step for smoothness
  const config = useMemo(() => ({
    gravity: [0, -2, 0],
    defaultContactMaterial: {
      restitution: 0.7, // Bounciness
    },
    iterations: 10,
  }), [])

  return (
    <Physics {...config} broadphase="SAP">
      {children}
    </Physics>
  )
}