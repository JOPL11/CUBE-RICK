'use client'
import { useState, useEffect, useRef, Suspense, useContext } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Loader, OrbitControls, MapControls, ScrollControls, useScroll, Scroll} from '@react-three/drei'
import AntiWPSplash from './AntiWPSlash2'
import InteractiveCubesScene from './ICS_C'
import RedDot from './RedDot4'
import DecorativeCubes from './DecorativeCubes_2'
import Header from './Header'
import BackgroundColor from './BackgroundColor'
import { ThemeContext } from './Header'
import { theme } from '../config/theme'

function CameraController({ isMapMode }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!camera) return
    
    console.log('Camera settings applied:', {
      position: camera.position,
      mode: isMapMode ? 'Map Mode' : 'Orbit Mode'
    })
    camera.position.set(
      isMapMode ? 0 : 9, 
      isMapMode ? 12 : 8, 
      isMapMode ? 0 : 9)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
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
  const [darkMode, setDarkMode] = useState(false)
  const [isMapMode, setIsMapMode] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState(() => {
    // Retrieve language from localStorage, default to 'en' if not set
    const savedLanguage = localStorage.getItem('preferredLanguage');
    console.log('Initial Language from localStorage:', savedLanguage);
    return savedLanguage || 'en';
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
    
    localStorage.setItem('preferredLanguage', normalizedLang);
    console.log('Stored Language in localStorage:', localStorage.getItem('preferredLanguage'));
    
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
          <ScrollControls pages={3} enabled={isMapMode}>
            <SceneContents 
            isMapMode={isMapMode} 
            darkMode={darkMode}  
            activeLanguage={activeLanguage}/>
          </ScrollControls>
        </Canvas>
        <Loader />
      </div>
    </ThemeContext.Provider>
  )
}

function SceneContents({ isMapMode, darkMode, activeLanguage  }) {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    if (isMapMode && scroll) {
      // Calculate scroll progress (0 to 1)
      const scrollProgress = scroll.offset;
      
      // Map scroll progress to camera movement
      // Assuming sections are at z positions: 11, 22, 33
      const targetZ = 11 + scrollProgress * 22;
      
      camera.position.z = targetZ;
      camera.lookAt(0, 0, targetZ);
    }
  });
  return (
    <>
      <CameraController isMapMode={isMapMode} />
      <BackgroundColor darkMode={darkMode} />
      <ambientLight intensity={darkMode ? theme.dark.ambientIntensity : theme.light.ambientIntensity} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={darkMode ? theme.dark.spotIntensity : theme.light.spotIntensity} />
      <pointLight position={[-10, -10, -10]} intensity={darkMode ? theme.dark.pointIntensity : theme.light.pointIntensity} />
      
      <Suspense fallback={null}>
        <Environment files="/images/kloppenheim_02_puresky_1k.hdr" background={false} />
        <RedDot />
        <InteractiveCubesScene isMapMode={isMapMode} activeLanguage={activeLanguage}/>
        <DecorativeCubes color={'#ffffff'} />
        <Scroll>
        <Section position={[0, 1, 11]} color={darkMode ? theme.dark.sectionColor : theme.light.sectionColor} />
        </Scroll>
        <Scroll>
        <Section position={[0, 1, 22]} color={darkMode ? theme.dark.sectionColor : theme.light.sectionColor} />
        </Scroll>
        <Scroll>
        <Section position={[0, 1, 33]} color={darkMode ? theme.dark.sectionColor : theme.light.sectionColor} />
        </Scroll>
      </Suspense>
    </>
  )
}

function Section({ position, color }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[10, 7, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}