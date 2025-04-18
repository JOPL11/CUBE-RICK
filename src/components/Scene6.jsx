'use client'

import { useState, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Loader, ContactShadows } from '@react-three/drei'
import { PhysicsWorld } from '@react-three/cannon'
import { gsap } from 'gsap'
import AntiWPSplash from './AntiWPSplash'
import CameraAnimation from './CameraAnimation'
import RedDot from './RedDot4'
import InteractiveCubes, { initialCubeTexts } from './InteractiveCubes'
import CubeEditorUI from './CubeEditorUIB'

export default function Scene() {
  const [selectedCube, setSelectedCube] = useState(null)
  const [cubeTexts] = useState(initialCubeTexts)
  const canvasRef = useRef()
  const controlsRef = useRef()

  const handleCubeSelect = (index) => {
    setSelectedCube(index)
  }

  const handleCloseEditor = () => {
    setSelectedCube(null)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AntiWPSplash />
      <Canvas
        ref={canvasRef}
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
        
        <Environment 
          files="/images/kloppenheim_02_puresky_1k.hdr"
          background={false}
        />
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
          <CameraAnimation controlsRef={controlsRef} />
          <OrbitControls 
            ref={controlsRef}
            enableZoom={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minDistance={3}
            maxDistance={14}
          />
          <InteractiveCubes onCubeSelect={handleCubeSelect} />
          <RedDot/>
        </PhysicsWorld>
      </Canvas>
      
      <Loader />
      <CubeEditorUI 
        selectedCube={selectedCube} 
        cubeTexts={cubeTexts} 
        onClose={handleCloseEditor} 
      />
    </div>
  )
}