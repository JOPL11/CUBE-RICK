'use client'

import { useState, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { TextureLoader } from 'three'
import Cube from './Cube'

const CUBE_SIZE = 2 // Size of each cube
const CUBE_SPACING = 2.1 // Space between cube centers (almost touching)
const CUBE_Y_POSITION = 0 // Consistent Y position for all cubes
const MOBILE_BREAKPOINT = 768 // Width in pixels for mobile/desktop breakpoint
const MOBILE_HORIZONTAL_SPACING = 1.05 // Adjusted horizontal spacing for mobile

const initialCubeTexts = [
  { topLeftText: "LEGACY SITE", bottomRightText: "OPENS IN A NEW TAB", description: "Currently migrating to this new Next.js + React 3 Fiber format - until its done, you can check out the old html5 site.", externalUrl: "https://www.jopl.de/2/index2.html" },
  { topLeftText: "VISUALIZATION", bottomRightText: "OPENS IN A NEW TAB", description: `WARNING:`, externalUrl: "https://www.jopl.de/2/playground.html" },
  { topLeftText: "ABOUT ME", 
    bottomRightText: "SKILLS", 
    description: ` A ` },
  { topLeftText: "AFTER EFFECTS", bottomRightText: "2D / 3D MOTION DESIGN", description: `Motion skills`, videoUrl: "https://www.jopl.de/2/video/reel.mp4"  },
  { topLeftText: `CINEMA4D /
SOFTER`, bottomRightText: "MOTION REEL SHORT", description: `Showreel `, videoUrl: "https://www.jopl.de/videos/Reeler_2025_Fader.mp4#t=0,loop"    },
  { topLeftText: `ANIMATION /
HARDER`, bottomRightText: "MOTION REEL LONG", description: `Showreel showing`, videoUrl: "https://www.jopl.de/2/video/reel.mp4#t=0,loop"  },
  { topLeftText: `WEBGL / WEBXR /
R3F / AR / VR / 3.JS`, bottomRightText: "INTERACTIVE", description: `WARNING:`, externalUrl: "https://www.jopl.de/2/experiments.html" },
  { topLeftText: "NEXT.JS", bottomRightText: "COMING SOON", description: "" },
  { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: ``  },
]

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


  

  
export default function InteractiveCubes() {
  const [selectedCube, setSelectedCube] = useState(null)
  const [cubeTexts, setCubeTexts] = useState(initialCubeTexts)
  const [isMobile, setIsMobile] = useState(false)
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
    return index % 2 === 0 ? "white" : "#3d3d3d"
  }

  const handleCubeSelect = (index) => {
    setSelectedCube(index)
  }

  const handleCloseEditor = () => {
    setSelectedCube(null)
  }

  const renderCubes = () => {
    if (isMobile) {
      const Z_OFFSET = -3.0;
      return (
        <>
          {/* First row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[0].topLeftText}
                bottomRightText={cubeTexts[0].bottomRightText}
                onClick={() => handleCubeSelect(0)}
                color={getCubeColor(0)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[1].topLeftText}
                bottomRightText={cubeTexts[1].bottomRightText}
                onClick={() => handleCubeSelect(1)}
                color={getCubeColor(1)}
              />
            </Float>
          </group>

          {/* Second row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0  + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[2].topLeftText}
                bottomRightText={cubeTexts[2].bottomRightText}
                onClick={() => handleCubeSelect(2)}
                color={getCubeColor(2)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[3].topLeftText}
                bottomRightText={cubeTexts[3].bottomRightText}
                onClick={() => handleCubeSelect(3)}
                color={getCubeColor(3)}
              />
            </Float>
          </group>

          {/* Third row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[4].topLeftText}
                bottomRightText={cubeTexts[4].bottomRightText}
                onClick={() => handleCubeSelect(4)}
                color={getCubeColor(4)}
                logo={logoTexture} 
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[5].topLeftText}
                bottomRightText={cubeTexts[5].bottomRightText}
                onClick={() => handleCubeSelect(5)}
                color={getCubeColor(5)}
              />
            </Float>
          </group>

          {/* Fourth row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[6].topLeftText}
                bottomRightText={cubeTexts[6].bottomRightText}
                onClick={() => handleCubeSelect(6)}
                color={getCubeColor(6)}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[7].topLeftText}
                bottomRightText={cubeTexts[7].bottomRightText}
                onClick={() => handleCubeSelect(7)}
                color={getCubeColor(7)}
              />
            </Float>
          </group>

          {/* Fifth row (single cube) */}
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING * 3 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[8].topLeftText}
                bottomRightText={cubeTexts[8].bottomRightText}
                onClick={() => handleCubeSelect(8)}
                color={getCubeColor(8)}
              />
            </Float>
          </group>
        </>
      )
    } else {
      return (
        <>
          {/* First row */}
          <group position={[-CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[0].topLeftText}
                bottomRightText={cubeTexts[0].bottomRightText}
                onClick={() => handleCubeSelect(0)}
                color={getCubeColor(0)}
              />
            </Float>
          </group>
          <group position={[0, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[1].topLeftText}
                bottomRightText={cubeTexts[1].bottomRightText}
                onClick={() => handleCubeSelect(1)}
                color={getCubeColor(1)}
              />
            </Float>
          </group>
          <group position={[CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[2].topLeftText}
                bottomRightText={cubeTexts[2].bottomRightText}
                onClick={() => handleCubeSelect(2)}
                color={getCubeColor(2)}
              />
            </Float>
          </group>

          {/* Second row */}
          <group position={[-CUBE_SPACING, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[3].topLeftText}
                bottomRightText={cubeTexts[3].bottomRightText}
                onClick={() => handleCubeSelect(3)}
                color={getCubeColor(3)}
              />
            </Float>
          </group>
          <group position={[0, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[4].topLeftText}
                bottomRightText={cubeTexts[4].bottomRightText}
                onClick={() => handleCubeSelect(4)}
                color={getCubeColor(4)}
                logo={logoTexture}
              />
            </Float>
          </group>
          <group position={[CUBE_SPACING, CUBE_Y_POSITION, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[5].topLeftText}
                bottomRightText={cubeTexts[5].bottomRightText}
                onClick={() => handleCubeSelect(5)}
                color={getCubeColor(5)}
              />
            </Float>
          </group>

          {/* Third row */}
          <group position={[-CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[6].topLeftText}
                bottomRightText={cubeTexts[6].bottomRightText}
                onClick={() => handleCubeSelect(6)}
                color={getCubeColor(6)}
              />
            </Float>
          </group>
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[7].topLeftText}
                bottomRightText={cubeTexts[7].bottomRightText}
                onClick={() => handleCubeSelect(7)}
                color={getCubeColor(7)}
              />
            </Float>
          </group>
          <group position={[CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={cubeTexts[8].topLeftText}
                bottomRightText={cubeTexts[8].bottomRightText}
                onClick={() => handleCubeSelect(8)}
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
      {renderCubes()}

      
      {/* Editor UI */}
      {selectedCube !== null && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#15171c',
          padding: '20px',
          borderRadius: '2px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.8)',
          zIndex: 1000,
          color: '#e0e0e0',
          width: '350px',
          maxHeight: '80vh',
          display: 'flex',
          fontFamily: 'InterDisplay-ExtraLight, sans-serif',
          flexDirection: 'column'
        }}>
          <div style={{
            marginBottom: '15px',
            fontFamily: 'InterDisplay-Bold, sans-serif'
          }}>
            <div style={{ fontSize: '1.2em' }}>
              {cubeTexts[selectedCube].topLeftText}
            </div>
            <div style={{ fontSize: '0.9em', color: '#aaa' }}>
              {cubeTexts[selectedCube].bottomRightText}
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '8px',
            whiteSpace: 'pre-line',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'InterDisplay-ExtraLight, sans-serif'
          }}>
            {cubeTexts[selectedCube].description.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ 
                marginBottom: '1em',
                lineHeight: '1.5'
              }}>
                {paragraph}
              </p>
            ))}
          </div>
          
          {cubeTexts[selectedCube].videoUrl && (
            <button
              onClick={() => window.open(cubeTexts[selectedCube].videoUrl, '_blank')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f57500',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              </svg>
              Watch Video
            </button>
          )}
          
          {cubeTexts[selectedCube].externalUrl && (
            <button
              onClick={() => window.open(cubeTexts[selectedCube].externalUrl, '_blank')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f57500',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LinkIcon />
              Open URL
            </button>
          )}
          
          <button 
            onClick={handleCloseEditor}
            style={{ 
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#404040',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  )
}