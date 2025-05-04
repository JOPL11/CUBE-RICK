'use client'

import { useState, useEffect, useRef, Suspense, useContext, memo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Loader, ContactShadows, Float, OrbitControls, Html } from '@react-three/drei'
import AntiWPSplash from './AntiWPSplash'
import CameraAnimation from './CameraAnimation'
import InteractiveCubesScene from './ICS_C'
import RedDot from './RedDot4'
import DecorativeCubes from './DecorativeCubes_2'
import Header from './Header'
import BackgroundColor from './BackgroundColor'
import { ThemeContext } from './Header'
import { theme } from '../config/theme'

// Add right after imports but before component
const cameraDebug = {
  log: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      const debugEl = document.getElementById('camera-debug') || 
        document.body.appendChild(document.createElement('div'));
      debugEl.id = 'camera-debug';
      debugEl.style.position = 'fixed';
      debugEl.style.bottom = '10px';
      debugEl.style.right = '10px';
      debugEl.style.color = 'white';
      debugEl.style.backgroundColor = 'rgba(0,0,0,0.0)';
      debugEl.style.padding = '10px';
      debugEl.style.maxHeight = '100px';
      debugEl.style.overflow = 'auto';
      debugEl.style.borderRadius = '8px';
      debugEl.style.opacity = '1';
      debugEl.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>`;
    }
  }
};

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

const Scene = memo(() => {
  useEffect(() => {
    cameraDebug.log('Scene initialized');
    return () => document.getElementById('camera-debug')?.remove();
  }, []);

  const controlsRef = useRef();
  const [darkMode, setDarkMode] = useState(false);
  const [fogEnabled, setFogEnabled] = useState(true);

  return (
    <div className="relative min-h-screen">
      <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} fogEnabled={fogEnabled} setFogEnabled={setFogEnabled} />
        <div className="absolute inset-0">
          <Canvas
            camera={{
              position: [0, 0, 10],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0, 0, 0, 0);
            }}
            dpr={[1, 2]}
            shadows
            style={{
              width: '100vw',
              height: '100vh',
              background: 'transparent'
            }}
          >
            <Suspense fallback={<Loader />}>
              {fogEnabled && (
                <fog attach="fog" args={[
                  darkMode ? theme.dark.fogColor : theme.light.fogColor, 
                  darkMode ? theme.dark.fogNear : theme.light.fogNear, 
                  darkMode ? theme.dark.fogFar : theme.light.fogFar
                ]} />
              )}
              <ThemeContext.Provider value={theme.light}>
                <BackgroundColor darkMode={false} />
                <ambientLight intensity={theme.light.ambientIntensity} />
                <spotLight 
                  position={[10, 10, 10]} 
                  angle={0.15} 
                  penumbra={1} 
                  intensity={theme.light.spotIntensity} 
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <pointLight 
                  position={[-10, -10, -10]} 
                  intensity={theme.light.pointIntensity} 
                />
                <Environment 
                  files="/images/kloppenheim_02_puresky_1k.hdr"
                  background={false}
                />
                <RedDot />
                <OrbitControls 
                  enableZoom={true}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 1.8}
                  minDistance={3}
                  maxDistance={14}
                  smoothTime={0.1}
                />
                <CameraAnimation />
                <InteractiveCubesScene />
                <DecorativeCubes color={'#f57500'} />
              </ThemeContext.Provider>
              <pointLight 
                position={[-10, -10, -10]} 
                intensity={darkMode ? theme.dark.pointIntensity : theme.light.pointIntensity} 
              />
            </Suspense>
          </Canvas>
        </div>
      </ThemeContext.Provider>
      <AntiWPSplash />
    </div>
  );
})

export default Scene;
