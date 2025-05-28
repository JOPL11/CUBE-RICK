'use client'

import { useState, useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { Float, OrbitControls, Html } from '@react-three/drei'
import { TextureLoader } from 'three'
import Cube from './Cube'

import PhysicsWorld from './PhysicsWorld'

const CUBE_SIZE = 2 // Size of each cube
const CUBE_SPACING = 2.1 // Space between cube centers (almost touching)
const CUBE_Y_POSITION = 0 // Consistent Y position for all cubes
const MOBILE_BREAKPOINT = 768 // Width in pixels for mobile/desktop breakpoint
const MOBILE_HORIZONTAL_SPACING = 1.05 // Adjusted horizontal spacing for mobile

const initialCubeTexts = [
  { topLeftText: "LEGACY SITE", bottomRightText: "OPENS IN A NEW TAB", description: "Currently migrating to this new Next.js + React 3 Fiber format - until its done, you can check out the old html5 site.", externalUrl: "https://www.jopl.de/2/index2.html" },
  { topLeftText: "VISUALIZATION", bottomRightText: "OPENS IN A NEW TAB", description: `WARNING: This link leads to an experimental playground.
    A collection of personal experiments showcasing:

    - 3D modeling/rendering
    - Post-production VFX
    - Free-jazz inspired motion design
    
    Pure creative play - no commercial constraints.
    Not for the corporately obsessed.`, externalUrl: "https://www.jopl.de/2/playground.html" },
  { topLeftText: "ABOUT ME", 
    bottomRightText: "SKILLS", 
    description: ` A multidisciplinary creator from Montreal Canada, passionate about design, 3D, code, and motion - ranging from strict brand systems to boundary-pushing exhibits.

Studied Communication-Design in Munich Germany. Currently based in Germany.

I create and implement visual concepts, from original designs to refining existing CI/CD systems, with expertise in animation and interactive development. 3+ years management experience.

15+ years collaborating with agencies, in-house teams, and startups - balancing innovation with brand compliance, ensuring visual consistency across all deliverables.

Design skills include Layout, Screen-Design, Print, Illustration, Painting, Concept Sketches, Typography, CI, Campaign Psychology, Adobe Suite.

Motion skills include 3D Modeling, 2D/3D Animation, Cinema4D, Blender. Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing. Render Engines: Octane, Redshift, Corona, Media Encoder, Handbrake and a ton of related peripheral stuff that, I mean we're gonna be here all day if I have to mention everything. Let's not get ludicrous. Some guy: "Do you do Advanced Lighting?" Me: "Yes, I do Advanced Lighting." I do Motion; From visual & motion concept to 2D / 3D asset-creation to screen-design to render, edit & post-production.

Code skills include Next.js, Three.js, React 3 Fiber (for Germans: that's WebGL with a React base), WebXR, AFrame, GSAP, javascript, html5, css, Vite, npm, yarn.

AI Skills include Stable Diffusion with custom workflows via ComfyUI, LoRAs and leveraging LLM's to achieve my goals, not the other way around.

Spoken languages are English, German, Spanish and French. Canada / EU dual citizen.

Zum Thema Deutsche Sprache: Ich kommuniziere direkt und unverschluesselt - so, wie es im Duden steht, nicht wie im Wirtschaftsprotokoll. ` },
  { topLeftText: "AFTER EFFECTS", bottomRightText: "2D / 3D MOTION DESIGN", description: `Motion skills include 3D Modeling, 2D/3D Animation, Cinema4D, Blender. 
    
    Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing. 
    
    Render Engines: Octane, Redshift, Corona, Media Encoder, Handbrake and a ton of related peripheral stuff that, I mean we're gonna be here all day if I have to mention everything. Let's not get ludicrous. 
    
    Some guy: "Do you do Advanced Lighting?" Me: "Yes, I do Advanced Lighting." 
    
    I do Motion; From visual & motion concept to 2D / 3D asset-creation to screen-design to render, edit & post-production. 
    
    Opens in a new window.`, videoUrl: "https://www.jopl.de/2/video/reel.mp4"  },
  { topLeftText: `CINEMA4D /
SOFTER`, bottomRightText: "MOTION REEL SHORT", description: `Showreel showing pure 3D Motion-design.

    - Corporate Logos showcase the companies the scenes were made for.
    - A short but sweet description of the project was added for many projects. 


    Opens in a new window.`, videoUrl: "https://www.jopl.de/videos/Reeler_2025_Fader.mp4#t=0,loop"    },
  { topLeftText: `ANIMATION /
HARDER`, bottomRightText: "MOTION REEL LONG", description: `Showreel showing 3D Motion-design, 2D Motion Design, 2D Text animation,  2D Character Animation in 3D Environments, IK Animation, basically the full sandwich, almost. 

    - Corporate Logos showcase the companies the scenes were made for.
    - Basically a motion smorgasbord of skills used for real projects. 


    Opens in a new window.`, videoUrl: "https://www.jopl.de/2/video/reel.mp4#t=0,loop"  },
  { topLeftText: `WEBGL / WEBXR /
R3F / AR / VR / 3.JS`, bottomRightText: "INTERACTIVE", description: `WARNING: This link leads to an experimental playground.

    A collection of personal experiments showcasing:

    - Interactive 3D WebGL Experiments
    - WebXR Experiments for use in the Quest3S headset.(Which is awesome by the way.)
    
    Pure creative play - no commercial constraints. Not for the corporately obsessed.

    Opens in a new window.`, externalUrl: "https://www.jopl.de/2/experiments.html" },
  { topLeftText: "NEXT.JS", bottomRightText: "COMING SOON", description: "" },
  { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: `Angaben gemäß § 5 TMG

Jan Peiro-Lehmann
Kommunikationsdesigner Dipl.
Center for Innovation & Technology (TZL)
Donnersbergweg 1
67059 Ludwigshafen am Rhein

Kontakt

Telefon: (+49) 01520 - 317 2291
E-Mail: jan.peiro@protonmail.com


Es gelten folgende berufsrechtliche Regelungen:
Verbraucher­streit­beilegung/
Universal­schlichtungs­stelle

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

Haftung für Inhalte

Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

Haftung für Links

Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

Urheberrecht

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

Datenschutzerklärung

Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:

Jan Peiro-Lehmann

Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

Quelle: e-recht24.de `  },
]

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function CubeLayout({ onCubeSelect }) {
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

  if (isMobile) {
    const Z_OFFSET = -3.0;
    return (
      <>
        {/* First row */}
        <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[0].topLeftText}
              bottomRightText={initialCubeTexts[0].bottomRightText}
              onClick={() => onCubeSelect(0)}
              color={getCubeColor(0)}
            />
          </Float>
        </group>
        <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
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
        <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[2].topLeftText}
              bottomRightText={initialCubeTexts[2].bottomRightText}
              onClick={() => onCubeSelect(2)}
              color={getCubeColor(2)}
            />
          </Float>
        </group>
        <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
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
        <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
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
        <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
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
        <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[6].topLeftText}
              bottomRightText={initialCubeTexts[6].bottomRightText}
              onClick={() => onCubeSelect(6)}
              color={getCubeColor(6)}
            />
          </Float>
        </group>
        <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
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
        <group position={[0, CUBE_Y_POSITION, CUBE_SPACING * 3 + Z_OFFSET]}>
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

export default function InteractiveCubesScene() {
  const [selectedCube, setSelectedCube] = useState(null)
  const controlsRef = useRef()

  const handleCubeSelect = (index) => {
    setSelectedCube(index)
  }

  const handleCloseEditor = () => {
    setSelectedCube(null)
  }

  return (
    <PhysicsWorld>
      <CubeLayout onCubeSelect={handleCubeSelect} />
     
      {/* Editor UI */}
    {/* Editor UI */}
    {selectedCube !== null && (
       <Html
       className="html-panel"
       calculatePosition={(el, camera, size) => {
        return [size.width / 2 - 225, 20]
      }}
      style={{
        width: '450px',
        pointerEvents: 'auto',
        touchAction: 'auto',
        zIndex: 1000,
      }}
    >
    <div 
       style={{
         position: 'relative',
         top: '0',
         left: '50%',
         transform: 'translate(-50%, 0)',
         width: '400px',
         pointerEvents: 'auto',
         touchAction: 'auto',
         margin: '0 20px',
         padding: '20px',
         zIndex: 1000,
       }}
     >
       <div 
         style={{
           background: '#15171c',
           padding: '20px',
           borderRadius: '8px',
           boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
           color: '#e0e0e0',
           width: '100%',
           maxHeight: '80vh',
           display: 'flex',
           fontFamily: 'InterDisplay-ExtraLight, sans-serif',
           flexDirection: 'column',
           pointerEvents: 'auto',
           touchAction: 'auto',
           zIndex: 1000,
           WebkitTapHighlightColor: 'transparent',
         }}
         onClick={(e) => e.stopPropagation()}
         onTouchStart={(e) => e.stopPropagation()}
         onTouchMove={(e) => e.stopPropagation()}
         onTouchEnd={(e) => e.stopPropagation()}
         onWheel={(e) => e.stopPropagation()} 
       >
            {/* Header */}
            <div style={{
              marginBottom: '15px',
              fontFamily: 'InterDisplay-Bold, sans-serif'
            }}>
              <div style={{ fontSize: '1.2em' }}>
                {initialCubeTexts[selectedCube].topLeftText}
              </div>
              <div style={{ fontSize: '0.9em', color: '#aaa' }}>
                {initialCubeTexts[selectedCube].bottomRightText}
              </div>
            </div>
            
            {/* Text content with perfect paragraph handling */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              fontFamily: 'InterDisplay-ExtraLight, sans-serif'
            }}>
              {initialCubeTexts[selectedCube].description.split('\n\n').map((paragraph, i) => (
                <p key={i} style={{ 
                  marginBottom: '1em',
                  lineHeight: '1.5'
                }}>
                  {paragraph}
                </p>
              ))}
            </div>
          
            {initialCubeTexts[selectedCube].videoUrl && (
              <button
                onClick={() => window.open(initialCubeTexts[selectedCube].videoUrl, '_blank')}
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
            
            {initialCubeTexts[selectedCube].externalUrl && (
              <button
                onClick={() => window.open(initialCubeTexts[selectedCube].externalUrl, '_blank')}
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
              onClick={(e) => {
                e.stopPropagation();
                handleCloseEditor();
              }}
              style={{ 
                marginTop: '15px',
                padding: '15px',
                backgroundColor: '#404040',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%',
                pointerEvents: 'auto',
                touchAction: 'auto',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Close
            </button>
          </div>
          </div>
        </Html>
      )}
    </PhysicsWorld>
  )
}
