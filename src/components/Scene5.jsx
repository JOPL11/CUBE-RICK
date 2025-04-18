'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Loader, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import AntiWPSplash from './AntiWPSplash'
import CameraAnimation from './CameraAnimation'
import InteractiveCubesScene from './InteractiveCubesScene'
import PhysicsWorld from './PhysicsWorld'
import RedDot from './RedDot4'

function DecorativeCubes() {
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



export default function Scene() {
  const controlsRef = useRef();
 
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
       <AntiWPSplash />
      <Canvas
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        camera={{
          position: [0, 11, 0],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor('#d3d3d3')
        }}
      >      

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
        <Environment 
        files="/images/kloppenheim_02_puresky_1k.hdr"
        background={false}/>
      <ContactShadows
        position={[0, -2, 0]}
        opacity={1}
        scale={150}
        blur={0.4}
        far={11}
        resolution={512}
        color="#000000"
        frames={1}
        renderOrder={2}
      />
        <PhysicsWorld>    
        <RedDot />
      <OrbitControls 
        ref={controlsRef}
        enableZoom={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={3}
        maxDistance={14}
        smoothTime={0.1}
      />
       <DecorativeCubes />
        <CameraAnimation controlsRef={controlsRef} />
        <OrbitControls 
        ref={controlsRef}
        enableZoom={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={3}
        maxDistance={14}
      />
        <InteractiveCubesScene />
        </PhysicsWorld>
        </Suspense>
      </Canvas>  
      <Loader />
    </div>
  )
}