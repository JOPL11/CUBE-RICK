'use client' // Must be first line

import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls, Loader, ContactShadows, Float } from '@react-three/drei'
import { TextureLoader, CircleGeometry, MeshStandardMaterial, Mesh } from 'three'
import { gsap } from 'gsap'
import Cube from './Cube'

const CUBE_SIZE = 2 // Size of each cube
const CUBE_SPACING = 2.1 // Space between cube centers (almost touching)
const CUBE_Y_POSITION = 0 // Consistent Y position for all cubes
const MOBILE_BREAKPOINT = 768 // Width in pixels for mobile/desktop breakpoint
const MOBILE_HORIZONTAL_SPACING = 1.05 // Adjusted horizontal spacing for mobile

const initialCubeTexts = [
  { topLeftText: "LEGACY SITE", bottomRightText: "OPENS IN A NEW TAB" },
  { topLeftText: "VISUALIZATION", bottomRightText: "OPENS IN A NEW TAB" },
  { topLeftText: "ABOUT ME", bottomRightText: "SKILLS" },
  { topLeftText: "AFTER EFFECTS", bottomRightText: "2D / 3D MOTION DESIGN" },
  { topLeftText: "CINEMA4D", bottomRightText: "MOTION REEL SHORT" },
  { topLeftText: "ANIMATION", bottomRightText: "MOTION REEL LONG" },
  { topLeftText: "CREATIVE CODE", bottomRightText: "INTERACTIVE" },
  { topLeftText: "REACT 3 FIBER", bottomRightText: "INTERACTIVE" },
  { topLeftText: "NEXT.JS", bottomRightText: "INTERACTIVE" }
]

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

function SceneContent({ onCubeSelect }) {
  const [isMobile, setIsMobile] = useState(false)
  const controlsRef = useRef()
  const logoTexture = useLoader(TextureLoader, '/images/logo.png')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getCubeColor = (index) => {
    return index % 2 === 0 ? "white" : "#1a1a1a"
  }

  const renderCubes = () => {
    if (isMobile) {
      // Mobile layout: 2 cubes per row with equidistant horizontal spacing
      return (
        <>
          {/* First row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[0].topLeftText}
                bottomRightText={initialCubeTexts[0].bottomRightText}
                onClick={() => onCubeSelect(0)}
                color={getCubeColor(0)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[1].topLeftText}
                bottomRightText={initialCubeTexts[1].bottomRightText}
                onClick={() => onCubeSelect(1)}
                color={getCubeColor(1)}
              />
            </Float>
          </group>

          {/* Second row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[2].topLeftText}
                bottomRightText={initialCubeTexts[2].bottomRightText}
                onClick={() => onCubeSelect(2)}
                color={getCubeColor(2)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[3].topLeftText}
                bottomRightText={initialCubeTexts[3].bottomRightText}
                onClick={() => onCubeSelect(3)}
                color={getCubeColor(3)}
              />
            </Float>
          </group>

          {/* Third row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[4].topLeftText}
                bottomRightText={initialCubeTexts[4].bottomRightText}
                onClick={() => onCubeSelect(4)}
                color={getCubeColor(4)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[5].topLeftText}
                bottomRightText={initialCubeTexts[5].bottomRightText}
                onClick={() => onCubeSelect(5)}
                color={getCubeColor(5)}
              />
            </Float>
          </group>

          {/* Fourth row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[6].topLeftText}
                bottomRightText={initialCubeTexts[6].bottomRightText}
                onClick={() => onCubeSelect(6)}
                color={getCubeColor(6)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[7].topLeftText}
                bottomRightText={initialCubeTexts[7].bottomRightText}
                onClick={() => onCubeSelect(7)}
                color={getCubeColor(7)}
              />
            </Float>
          </group>

          {/* Fifth row (single cube) */}
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING * 3]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[8].topLeftText}
                bottomRightText={initialCubeTexts[8].bottomRightText}
                onClick={() => onCubeSelect(8)}
                color={getCubeColor(8)}
              />
            </Float>
          </group>
        </>
      )
    } else {
      // Desktop layout: 3x3 grid
      return (
        <>
          {/* First row */}
          <group position={[-CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[0].topLeftText}
                bottomRightText={initialCubeTexts[0].bottomRightText}
                onClick={() => onCubeSelect(0)}
                color={getCubeColor(0)}
              />
            </Float>
          </group>
          <group position={[0, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[1].topLeftText}
                bottomRightText={initialCubeTexts[1].bottomRightText}
                onClick={() => onCubeSelect(1)}
                color={getCubeColor(1)}
              />
            </Float>
          </group>
          <group position={[CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[2].topLeftText}
                bottomRightText={initialCubeTexts[2].bottomRightText}
                onClick={() => onCubeSelect(2)}
                color={getCubeColor(2)}
              />
            </Float>
          </group>

          {/* Second row */}
          <group position={[-CUBE_SPACING, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[3].topLeftText}
                bottomRightText={initialCubeTexts[3].bottomRightText}
                onClick={() => onCubeSelect(3)}
                color={getCubeColor(3)}
              />
            </Float>
          </group>
          <group position={[0, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[4].topLeftText}
                bottomRightText={initialCubeTexts[4].bottomRightText}
                onClick={() => onCubeSelect(4)}
                color={getCubeColor(4)}
                logo={logoTexture}
              />
            </Float>
          </group>
          <group position={[CUBE_SPACING, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[5].topLeftText}
                bottomRightText={initialCubeTexts[5].bottomRightText}
                onClick={() => onCubeSelect(5)}
                color={getCubeColor(5)}
              />
            </Float>
          </group>

          {/* Third row */}
          <group position={[-CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[6].topLeftText}
                bottomRightText={initialCubeTexts[6].bottomRightText}
                onClick={() => onCubeSelect(6)}
                color={getCubeColor(6)}
              />
            </Float>
          </group>
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[7].topLeftText}
                bottomRightText={initialCubeTexts[7].bottomRightText}
                onClick={() => onCubeSelect(7)}
                color={getCubeColor(7)}
              />
            </Float>
          </group>
          <group position={[CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[8].topLeftText}
                bottomRightText={initialCubeTexts[8].bottomRightText}
                onClick={() => onCubeSelect(8)}
                color={getCubeColor(8)}
              />
            </Float>
          </group>
        </>
      )
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Environment 
        files="/images/kloppenheim_02_puresky_1k.hdr"
        background={false}
        blur={0.5}
      />
      <OrbitControls 
        ref={controlsRef}
        enableZoom={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={3}
        maxDistance={10}
      />
      
      {renderCubes()}
      <DecorativeCubes />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
        resolution={256}
        color="#000000"
        frames={1}
        renderOrder={2}
      />
    </>
  )
}

export default function Scene() {
  const [selectedCube, setSelectedCube] = useState(null)
  const [cubeTexts, setCubeTexts] = useState(initialCubeTexts)
  const canvasRef = useRef()

  const handleCubeSelect = (index) => {
    setSelectedCube(index)
  }

  const handleTextChange = (index, field, value) => {
    setCubeTexts(prev => {
      const newTexts = [...prev]
      newTexts[index] = {
        ...newTexts[index],
        [field]: value
      }
      return newTexts
    })
  }

  const handleCloseEditor = () => {
    setSelectedCube(null)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        ref={canvasRef}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        camera={{
          position: [-5, 5, 5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor('#ffffff')
        }}
      >
        <Suspense fallback={null}>
          <SceneContent onCubeSelect={handleCubeSelect} />
        </Suspense>
      </Canvas>
      <Loader />
      
      {/* Editor UI */}
      {selectedCube !== null && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          color: '#e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ffffff' }}>Edit Cube {selectedCube + 1}</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Top Left Text:</label>
            <input
              type="text"
              value={cubeTexts[selectedCube].topLeftText}
              onChange={(e) => handleTextChange(selectedCube, 'topLeftText', e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Bottom Right Text:</label>
            <input
              type="text"
              value={cubeTexts[selectedCube].bottomRightText}
              onChange={(e) => handleTextChange(selectedCube, 'bottomRightText', e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            />
          </div>
          <button 
            onClick={handleCloseEditor}
            style={{ 
              width: '100%',
              padding: '10px',
              backgroundColor: '#404040',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#505050'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#404040'}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}