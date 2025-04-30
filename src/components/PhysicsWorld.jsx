import { Physics } from '@react-three/cannon'
import { useMemo } from 'react'

export default function PhysicsWorld({ children }) {
  const config = useMemo(() => ({
    gravity: [0, -2, 0],
    defaultContactMaterial: {
      restitution: 0.7,  // Bounciness (0-1)
      friction: 0.2,     // Sliding resistance (0-1)
      contactEquationStiffness: 1e7  // Better stability
    },
    broadphase: 'SAP',   // Sweep and Prune algorithm
    allowSleep: true,    // Better performance for static objects
    iterations: 8,       // Quality/performance balance
    solverIterations: 6, // Collision resolution quality
    axisIndex: 1         // Optimize for Y-axis gravity
  }), [])

  return (
    <Physics {...config}>
      {children}
    </Physics>
  )
}