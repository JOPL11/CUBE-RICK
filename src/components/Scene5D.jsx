'use client'
import { useState, useEffect, useRef, Suspense, useContext } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, MapControls, Html } from '@react-three/drei'
import AntiWPSplash from './AntiWPSplash'
import InteractiveCubesScene from './ICS_C'
import RedDot from './RedDot4'
import DecorativeCubes from './DecorativeCubes_2'
import Header from './Header'
import BackgroundColor from './BackgroundColor'
import { ThemeContext } from './Header'
import { theme } from '../config/theme'

// Update your CameraController component
function CameraController({ isMapMode }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!camera) return
    
    console.log('Camera settings applied:', {
      position: camera.position,
      mode: isMapMode ? 'Map Mode' : 'Orbit Mode'
    });
    // Set camera position based on mode
    camera.position.set(isMapMode ? 0 : 5, isMapMode ? 11 : 5, isMapMode ? 3 : 5)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix(); // Ensure the camera updates
  }, [camera, isMapMode])


  return (
    <>
      {isMapMode ? (
        <MapControls
          ref={controlsRef}
          enableRotate={false}
          panSpeed={0.8}
          screenSpacePanning
          maxDistance={25}
          minDistance={5}
          enableDamping = {true}
          dampingFactor = {0.05}


        />
      ) : (
        <OrbitControls
          ref={controlsRef}
          minDistance={3}
          maxDistance={14}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minHeight={0}
          maxHeight={2}
          enableDamping = {true}
          dampingFactor = {0.05}

        />
      )}
      {console.log(`Rendered ${isMapMode ? 'MapControls' : 'OrbitControls'}`)}
    </>
  )
}


export default function Scene() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMapMode, setIsMapMode] = useState(true);
  




const handleToggleCameraMode = () => {
  setIsMapMode(!isMapMode);
  console.log(`Camera mode toggled: ${!isMapMode ? 'Map Mode' : 'Orbit Mode'}`);
};

  const MOBILE_BREAKPOINT = 768

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <AntiWPSplash />
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onToggleCameraMode={handleToggleCameraMode}
          isMapMode={isMapMode}
        />


        <Canvas
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          camera={{
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          dpr={[1, 2]}
        >
          <CameraController isMapMode={isMapMode} />
          
          <BackgroundColor darkMode={darkMode} />
          <ambientLight intensity={darkMode ? theme.dark.ambientIntensity : theme.light.ambientIntensity} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? theme.dark.spotIntensity : theme.light.spotIntensity} />
          <pointLight position={[-10, -10, -10]} intensity={darkMode ? theme.dark.pointIntensity : theme.light.pointIntensity} />
          
          <Suspense fallback={null}>
            <Environment 
              files="/images/kloppenheim_02_puresky_1k.hdr"
              background={false}
            />

            <RedDot />
            <InteractiveCubesScene />
            <DecorativeCubes color={'#ffffff'} />
          </Suspense>
        </Canvas>
        
        <Loader />
      </div>
    </ThemeContext.Provider>
  )
}