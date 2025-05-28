'use client'
import { useState, useEffect, useRef, Suspense, useContext } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, MapControls, ScrollControls, useScroll } from '@react-three/drei'
import AntiWPSplash from './AntiWPSlash3'
import InteractiveCubesScene from './ICS_C'
import RedDot from './RedDot4'
import DecorativeCubes2 from './DecorativeCubes_2'
import Header from './Header'
import BackgroundColor from './BackgroundColor'
import { ThemeContext } from './Header'
import { theme } from '../config/theme'
import { CAMERA_SETTINGS } from '../config/cameraSettings'
import CameraController from './CameraController' 

function CameraModeController({ isMapMode }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!camera) return
    
    console.log('[CameraModeController Function] Camera settings applied:', {
      position: camera.position,
      mode: isMapMode ? 'Map Mode' : 'Orbit Mode'
    })
    camera.position.set(
      isMapMode ? 0 : 7, 
      isMapMode ? 14 : 2, 
      isMapMode ? 3 : 2)
    camera.lookAt(0, 0, 5)
    camera.updateProjectionMatrix()
      // Log controls setup
      if (isMapMode) {
        console.log('[CameraModeController Function] Setting up MapControls')
        // ... rest of controls setup
      } else {
        console.log('[CameraModeController Function] Setting up OrbitControls')
        // ... rest of controls setup
      }
    }, [camera, isMapMode])

  return (
    <>
      {isMapMode ? (
        <MapControls
          ref={controlsRef}
          enableRotate={false}
          panSpeed={0.8}
          screenSpacePanning
          maxDistance={35}
          minDistance={2}
          enableDamping={true}
          dampingFactor={0.1}
        />
      ) : (
        <OrbitControls
          ref={controlsRef}
          minDistance={2}
          maxDistance={35}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          enableDamping={true}
          dampingFactor={0.1}
        />
      )}
    </>
  )
}

export default function Scene() {
  const [darkMode, setDarkMode] = useState(true)
  const [isMapMode, setIsMapMode] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const cameraControllerRef = useRef(null);
  const [activeLanguage, setActiveLanguage] = useState(() => {
    // Retrieve language from localStorage, default to 'en' if not set
  //  const savedLanguage = localStorage.getItem('preferredLanguage');
  //  console.log('Initial Language from localStorage:', savedLanguage);
  //  return savedLanguage || 
  // 'en';
  return 'en';
  });

  const MOBILE_BREAKPOINT = 768

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    checkMobile()
    window.addEventListener('resize', checkMobile)
  
    // Set global language switcher
    window.globalHandleLanguageSwitcheroo = handleLanguageSwitcheroo;
  
    return () => {
      window.removeEventListener('resize', checkMobile)
      // Optional: clean up global function when component unmounts
      delete window.globalHandleLanguageSwitcheroo;
    }
  }, []);

  const handleToggleCameraMode = () => {
    setIsMapMode(!isMapMode)
    console.log(`Camera mode toggled: ${!isMapMode ? 'Map Mode' : 'Orbit Mode'}`)
  }
 
  const handleLanguageSwitcheroo = (targetLang) => {
    // Normalize language to ensure consistent mapping
    const normalizedLang = {
      'EN': 'en',
      'FR': 'fr',
      'DE': 'de'
    }[targetLang.toUpperCase()] || 'en';

    console.group('Language Switcher Process');
    console.log('Input Language:', targetLang);
    console.log('Normalized Language:', normalizedLang);
    
    setActiveLanguage(normalizedLang);
    console.log('Active Language Set:', normalizedLang);
    
    //localStorage.setItem('preferredLanguage', normalizedLang);
    //console.log('Stored Language in localStorage:', localStorage.getItem('preferredLanguage'));
    
    console.groupEnd();
  };

  console.log('Initial Active Language:', activeLanguage);

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <AntiWPSplash />
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onToggleCameraMode={handleToggleCameraMode}
          isMapMode={isMapMode}
          handleLanguageSwitcheroo={handleLanguageSwitcheroo}
          activeLanguage={activeLanguage} 
        />


        <Canvas
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ fov: 50, near: 0.1, far: 1000 }}
          dpr={[1, 2]}
        >
          <ScrollControls pages={0} enabled={isMapMode}>
            <SceneContents isMapMode={isMapMode} darkMode={darkMode}  activeLanguage={activeLanguage}/>
          </ScrollControls>
        </Canvas>
        <Loader />
      </div>
    </ThemeContext.Provider>
  )
}

function SceneContents({ isMapMode, darkMode, activeLanguage, cameraControllerRef }) {
  return (
    <>
      <CameraModeController isMapMode={isMapMode} />
      <CameraController isMapMode={isMapMode} ref={cameraControllerRef}/>
      <BackgroundColor darkMode={darkMode} />
      <ambientLight intensity={darkMode ? theme.dark.ambientIntensity : theme.light.ambientIntensity} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? theme.dark.spotIntensity : theme.light.spotIntensity} />
      <pointLight position={[-10, -10, -10]} intensity={darkMode ? theme.dark.pointIntensity : theme.light.pointIntensity} />
      
      <Suspense fallback={null}>
        <Environment files="/images/kloppenheim_02_puresky_1k.hdr" background={false} />
        <RedDot />
        <InteractiveCubesScene isMapMode={isMapMode} activeLanguage={activeLanguage} cameraControllerRef={cameraControllerRef}  />
        <DecorativeCubes2 color={'#ffffff'} />

      </Suspense>
    </>
  )
}

function Section({ position, color }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}