'use client'

import { useState, useEffect, useRef, Suspense, useContext } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Loader, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import AntiWPSplash from './AntiWPSplash'
import CameraAnimation from './CameraAnimation'
import InteractiveCubesScene from './ICS'
import RedDot from './RedDot4'
import DecorativeCubes from './DecorativeCubes_2'
import Header from './Header'
import BackgroundColor from './BackgroundColor'
import { ThemeContext } from './Header'
import { theme } from '../config/theme'

function DecorativeCubesA() {
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
  const [darkMode, setDarkMode] = useState(false);
 
  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <AntiWPSplash />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
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
        >
          <BackgroundColor darkMode={darkMode} />
          <ambientLight intensity={darkMode ? theme.dark.ambientIntensity : theme.light.ambientIntensity} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? theme.dark.spotIntensity : theme.light.spotIntensity} />
          <pointLight position={[-10, -10, -10]} intensity={darkMode ? theme.dark.pointIntensity : theme.light.pointIntensity} />
          <Suspense fallback={null}>
          <Environment 
          files="/images/kloppenheim_02_puresky_1k.hdr"
          background={false}/>


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

          <CameraAnimation controlsRef={controlsRef} />
          <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 1.8}
          minDistance={3}
          maxDistance={14}
        />
          <InteractiveCubesScene />

          <DecorativeCubes color={'#f57500'} />
          </Suspense>
        </Canvas>  
        <Loader />
      </div>
    </ThemeContext.Provider>
  )
}