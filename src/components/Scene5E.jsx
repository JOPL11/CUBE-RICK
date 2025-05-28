'use client'
import { useState, useEffect, useRef, Suspense, useContext } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, MapControls, ScrollControls, SpotLight } from '@react-three/drei'
import AntiWPSplash from './AntiWPSplash'
import InteractiveCubesScene from './ICS_C'
import RedDot from './RedDot4'
import DecorativeCubes from './DecorativeCubes_2'
import Header from './Header'
import BackgroundColor from './BackgroundColor'
import { ThemeContext } from './Header'
import { theme } from '../config/theme'

function MovingUpwardSpotlight() {
  const lightRef = useRef()

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    // Horizontal movement (circular path)
    lightRef.current.position.x = Math.sin(time) * 2.5
    lightRef.current.position.z = Math.cos(time) * 2.5
    // Keep light at fixed height below cubes
    lightRef.current.position.y = -0.5 
    
    // Make the light point upwards by adjusting target
    lightRef.current.target.position.set(
      lightRef.current.position.x,  // Same x as light
      5,                           // Pointing up to y=5
      lightRef.current.position.z   // Same z as light
    )
  })

  return (
    <SpotLight
      ref={lightRef}
      position={[0, 0.5, 0]}
      angle={3.5}
      intensity={50040}
      penumbra={3.7}
      distance={30}
      castShadow
      shadow-mapSize={1024}
      color="#ffffff"
      attenuation={2}
      decay={2}
    >
      {/* Visual helper for the light target (optional) */}
      <mesh position={[0, 5, 0]} visible={false}>
        <sphereGeometry args={[0.1]} />
      </mesh>
    </SpotLight>
  )
}


function CameraController({ isMapMode }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!camera) return
    
    camera.position.set(isMapMode ? 0 : 5, isMapMode ? 11 : 5, isMapMode ? 3 : 5)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, isMapMode])

  return isMapMode ? (
    <MapControls
      ref={controlsRef}
      enableRotate={false}
      panSpeed={0.8}
      screenSpacePanning
      maxDistance={25}
      minDistance={5}
      enableDamping
      dampingFactor={0.05}
    />
  ) : (
    <OrbitControls
      ref={controlsRef}
      minDistance={3}
      maxDistance={14}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.1}
      enableDamping
      dampingFactor={0.05}
    />
  )
}

function SceneContents({ isMapMode, darkMode, activeLanguage }) {
  return (
    <>
      <CameraController isMapMode={isMapMode} />
      <BackgroundColor darkMode={darkMode} />
      <ambientLight intensity={darkMode ? 0.3 : 0.7} />
      <pointLight position={[10, 10, 10]} intensity={darkMode ? 0.5 : 1} />
      <pointLight position={[-10, -10, -10]} intensity={darkMode ? 0.2 : 0.5} />
      
      <MovingUpwardSpotlight />
      
      <Suspense fallback={null}>
        <Environment 
          files="/images/kloppenheim_02_puresky_1k.hdr" 
          background={false} 
          preset={null}
        />
        <RedDot />
        <InteractiveCubesScene isMapMode={isMapMode} activeLanguage={activeLanguage} castShadow  />
        <DecorativeCubes color={darkMode ? '#444' : '#ffffff'} />
      </Suspense>
    </>
  )
}

export default function Scene() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMapMode, setIsMapMode] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState('en')
  const MOBILE_BREAKPOINT = 768

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleToggleCameraMode = () => setIsMapMode(!isMapMode)
  const handleLanguageChange = (lang) => setActiveLanguage(lang)

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <AntiWPSplash />
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onToggleCameraMode={handleToggleCameraMode}
          isMapMode={isMapMode}
          handleLanguageSwitcheroo={handleLanguageChange}
          activeLanguage={activeLanguage} 
        />

        <Canvas
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ fov: 50, near: 0.1, far: 1000 }}
          dpr={[1, 2]}
          shadows
        >
          <ScrollControls pages={0} enabled={isMapMode}>
            <SceneContents 
              isMapMode={isMapMode} 
              darkMode={darkMode}
              activeLanguage={activeLanguage}
            />
          </ScrollControls>
        </Canvas>
        <Loader />
      </div>
    </ThemeContext.Provider>
  )
}