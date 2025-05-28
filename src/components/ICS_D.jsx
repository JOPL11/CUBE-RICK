'use client'

import { useState, useEffect, useRef } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, Html, Text, useScroll } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import gsap from 'gsap';
import { 
englishCubes,
germanCubes,
frenchCubes,
} from './cubeContent.js';

const LanguageFloat = ({ children, index, activeLanguage }) => {
  const groupRef = useRef();
  const floatRef = useRef();
  const animationRef = useRef({ pos: null, rot: null });
  
  // Initialize cube positions
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData = {
        baseY: groupRef.current.position.y,
        currentY: groupRef.current.position.y,
        currentRot: { ...groupRef.current.rotation }
      };
    }
    return () => {
      gsap.killTweensOf(animationRef.current.pos);
      gsap.killTweensOf(animationRef.current.rot);
    };
  }, []);

  // Language transition handler
  useEffect(() => {
    if (!groupRef.current) return;
    
    const { baseY } = groupRef.current.userData;
    const pos = groupRef.current.position;
    const rot = groupRef.current.rotation;
    
    // Cancel any ongoing animations
    gsap.killTweensOf(pos);
    gsap.killTweensOf(rot);
    
    // Transition to base position (0.8s)
    animationRef.current.pos = gsap.to(pos, {
      y: baseY,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        // Start language-specific behavior
        if (activeLanguage === 'de') {
          // German - precise lock
          gsap.set(pos, { y: baseY });
          gsap.set(rot, { x: 0, y: 0, z: 0 });
        } 
        else if (activeLanguage === 'fr') {
          // French - elegant wave
          const phase = index * 0.5;
          animationRef.current.pos = gsap.to(pos, {
            y: baseY + 0.5 * Math.sin(phase),
            duration: 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
          });
          animationRef.current.rot = gsap.to(rot, {
            z: 0.025 * Math.sin(phase * 0.23),
            duration: 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
          });
        }
      }
    });
  }, [activeLanguage, index]);

  return (
    <group ref={groupRef}>
      {activeLanguage === 'fr' ? (
        children
      ) : (
        <Float 
          ref={floatRef}
          speed={1.5} 
          rotationIntensity={0.05}
          floatIntensity={0.05}
        >
          {children}
        </Float>
      )}
    </group>
  );
};

import Cube from './Cube2'
import WideCube from './WideCube_C';
import Lightbox from './Lightbox'



const CUBE_SIZE = 2 // Size of each cube
const CUBE_SPACING = 2.1 // Space between cube centers (almost touching)
const CUBE_Y_POSITION = 0 // Consistent Y position for all cubes
const MOBILE_BREAKPOINT = 768 // Width in pixels for mobile/desktop breakpoint
const MOBILE_HORIZONTAL_SPACING = 1.05 // Adjusted horizontal spacing for mobile


  

  const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

const getCubeColor = (index) => {
  return index % 2 === 0 ? "white" : "#3d3d3d"
}

const MobileWideCube = ({ position, text, text2, onClick }) => {
  const width = CUBE_SPACING * 2.02;
  const height = CUBE_SIZE * 0.5;
  
  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.05}>
        {/* Cube Mesh */}
        <mesh onClick={onClick}>
          <boxGeometry args={[width-0.15, height+0.9, height+0.5 ]} />
          <meshStandardMaterial 
            color="white"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        
        {/* Proper Text Component */}
        <Text
          position={[-1.44, height * 1, -0.4]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.22}
          color="#3d3d3d"
          maxWidth={width * 0.9}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
        <Text
           position={[1.55, height * 1, 0.5]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.15}
          color="#3d3d3d"
          maxWidth={width * 0.9}
          anchorX="center"
          anchorY="middle"
        >
          {text2}
        </Text>
      </Float>
    </group>
  )
}




const WideCube2 = ({ position, text, text2, onClick }) => {
  const width = CUBE_SPACING * 3.05;
  const height = CUBE_SIZE * 0.8;
  
  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
        {/* WideCube Base */}
        <mesh onClick={onClick}>
          <boxGeometry args={[width-0.15, height+0.3, height+0.5]} />
          <meshStandardMaterial 
            color="white"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        {/* Purple Plane on Top Face */}
        <mesh position={[0, (height+0.3)/2 + 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>  {/* VIDEOPLANE HEIGHT */}
          <planeGeometry args={[width-0.15, height+0.5]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Texts */}
        <Text
          position={[-2.4, height * 0.6, -0.65]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.25}
          color="#3d3d3d"
          maxWidth={width * 0.9}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
        <Text
          position={[2.52, height * 0.6, 0.78]}
          rotation={[-Math.PI/2, 0, 0]}
          fontSize={0.15}
          color="#3d3d3d"
          maxWidth={width * 0.9}
          anchorX="center"
          anchorY="middle"
        >
          {text2}
        </Text>
      </Float>
    </group>
  );
};

function CubeLayout({ onCubeSelect, activeLanguage, onCubeClick}) {
    const [isMobile, setIsMobile] = useState(false)
    const logoTexture = useLoader(TextureLoader, '/images/logo2.png')
    const shadowTexture = useLoader(TextureLoader, '/images/shadows.png')
    const [showImpressum, setShowImpressum] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxContent, setLightboxContent] = useState(null);
    const groupRef = useRef();      
    

    const sections = [
        { position: [0, 0, 0], lookAt: [0, 0, 0] },
        { position: [0, -10, 5], lookAt: [0, -10, 0] },
        { position: [5, -20, 5], lookAt: [0, -20, 0] }
      ]
      useFrame(() => {
        if (!isMapMode) return
        
        // Vertical scroll effect
        const yOffset = scroll.offset * 30 // Adjust scroll speed
        camera.position.set(0, 15 - yOffset, 3)
        camera.lookAt(0, 15 - yOffset - 5, 0)
        
        if (groupRef.current) {
          groupRef.current.position.y = yOffset
        }
      })
    
    

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => {
        window.removeEventListener('resize', checkMobile)
        // Clean up any other resources if needed
      };
    }, [])


  
    const cubeTexts = activeLanguage === 'de' ? germanCubes : 
                     activeLanguage === 'fr' ? frenchCubes : 
                     englishCubes;


   {/* ===================================== MOBILE STARTS HERE ============================================================*/}

    if (isMobile) {
      const Z_OFFSET = -1.5;
      return (
        <>
            {/* Row Zero WIDECUBE 
            <group position={[0, CUBE_Y_POSITION + 2.0, -CUBE_SPACING * 3.95]}> */}
          {/* Ôåæ Adjust Y (+1) and Z (-2.5) to fine-tune placement
          <LottieHeader 
          path="/images/data_logo.json"
          position={[0, 0.0005, 1]}
          scale={0.7}
          opacity={0.5}
        />
        
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube
              key={`cube-0-${activeLanguage}-0`}
              position={[0, -2, 1]}
              topLeftText="HEADER"
              bottomRightText="VISUALS"
              onClick={() => console.log('Header clicked')}
              color="white"
              scale={[2, 3, 2]} // 3 cubes wide plus 2 gaps
              rotation={[0, 0, 0]}
            />
          </Float> 
        </group>  */}
          {/* First row       color={getCubeColor(0)} */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            
            <LanguageFloat index={0} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${0}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[0].topLeftText}
                bottomRightText={cubeTexts[0].bottomRightText}
                onClick={() => onCubeSelect(0)}
          
                color="#3d3d3d"
                videoUrl={cubeTexts[0].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            <LanguageFloat index={1} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${1}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[1].topLeftText}
                bottomRightText={cubeTexts[1].bottomRightText}
                onClick={() => onCubeSelect(1)}
                color="#3d3d3d"
                videoUrl={cubeTexts[1].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Second row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
        
            <LanguageFloat index={2} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${2}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[2].topLeftText}
                bottomRightText={cubeTexts[2].bottomRightText}
                onClick={() => onCubeSelect(2)}
             color="#3d3d3d"
                videoUrl={cubeTexts[2].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
            <LanguageFloat index={3} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${3}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[3].topLeftText}
                bottomRightText={cubeTexts[3].bottomRightText}
                onClick={() => onCubeSelect(3)}
                color="#3d3d3d"
                videoUrl={cubeTexts[3].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Third row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <LanguageFloat index={4} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${4}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[4].topLeftText}
                bottomRightText={cubeTexts[4].bottomRightText}
                onClick={() => onCubeSelect(4)}
                color="#3d3d3d"
                videoUrl={cubeTexts[4].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <LanguageFloat index={5} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${5}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[5].topLeftText}
                bottomRightText={cubeTexts[5].bottomRightText}
                onClick={() => onCubeSelect(5)}
                color={getCubeColor(5)}
                videoUrl={cubeTexts[5].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Fourth row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
            <LanguageFloat index={6} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${6}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[6].topLeftText}
                bottomRightText={cubeTexts[6].bottomRightText}
                onClick={() => onCubeSelect(6)}
               color="#3d3d3d"
                videoUrl={cubeTexts[6].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
          
            <LanguageFloat index={7} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${7}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[7].topLeftText}
                bottomRightText={cubeTexts[7].bottomRightText}
                onClick={() => onCubeSelect(7)}
                color="#3d3d3d"
                videoUrl={cubeTexts[7].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Fifth row (single cube) 
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING * 3 + Z_OFFSET]}>
            <LanguageFloat index={8} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${8}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[8].topLeftText}
                bottomRightText={cubeTexts[8].bottomRightText}
                onClick={() => onCubeSelect(8)}
                color={"white"}
                videoUrl={cubeTexts[8].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group> */}
          <mesh
            position={[0, -1.5, 0]} // adjust Y to match cube base
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
            scale={[6.5, 6.5, 1]} // covers the grid area
          >
            <planeGeometry args={[1.2, 3.2]} />
            <meshBasicMaterial
              map={shadowTexture}
              transparent={true}
              opacity={0.5}
              depthWrite={false}
              polygonOffset={true}
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </mesh> 
        </>
      )
    }
  
    return (
      <>
      {/* Row Zero ============================= DESKTOP STARTS HERE ============================================================*/}
          <group position={[0, CUBE_Y_POSITION + 0.0, -CUBE_SPACING * 2.5]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <WideCube
                position={[0, -0.1, 1]}
                topLeftText=""
                bottomRightText=""
                onClick={() => {
                  onCubeSelect(0);
                  onCubeClick(0);
                  console.log('WideCube clicked');
                }}
                color="#3d3d3d"
                videoUrl="/videos/sample4N.mp4"
              />
            </Float>
          </group>
        {/* First row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
            <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
                </group>
          <LanguageFloat index={0} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${0}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[0].topLeftText}
              bottomRightText={cubeTexts[0].bottomRightText}
              onClick={() => {
                onCubeSelect(0);
    
              }}
          
              color="#3d3d3d"
              videoUrl={cubeTexts[0].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[0, CUBE_Y_POSITION, -CUBE_SPACING]}>
      
          <LanguageFloat index={1} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${1}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[1].topLeftText}
              bottomRightText={cubeTexts[1].bottomRightText}
              onClick={() => {
                onCubeSelect(1);
                
              }}
              color="#3d3d3d"
              videoUrl={cubeTexts[1].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
  
          <LanguageFloat index={2} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${2}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[2].topLeftText}
              bottomRightText={cubeTexts[2].bottomRightText}
              onClick={() => {
                onCubeSelect(2);
               
              }}
             color="#3d3d3d"
              videoUrl={cubeTexts[2].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
  
        {/* Second row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, 0]}>
          
          <LanguageFloat index={3} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${3}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[3].topLeftText}
              bottomRightText={cubeTexts[3].bottomRightText}
              onClick={() => onCubeSelect(3)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[3].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[0, CUBE_Y_POSITION, 0]}>
    <LanguageFloat index={4} activeLanguage={activeLanguage}>
      <Cube 
        key={`cube-${4}-${activeLanguage}`}
        position={[0, 0, 0]}
        topLeftText={cubeTexts[4].topLeftText}
        bottomRightText={cubeTexts[4].bottomRightText}
        onClick={() => onCubeSelect(4)}
        color={getCubeColor(1)}
        videoUrl={cubeTexts[4].videoUrl}
        scale={[1, 1, 1]}
        rotation={[0, 0, 0]}
        logo={logoTexture}
      />
    </LanguageFloat>
  </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, 0]}>
          
          <LanguageFloat index={5} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${5}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[5].topLeftText}
              bottomRightText={cubeTexts[5].bottomRightText}
              onClick={() => onCubeSelect(5)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[5].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
  
        {/* Third row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
        
          <LanguageFloat index={6} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${6}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[6].topLeftText}
              bottomRightText={cubeTexts[6].bottomRightText}
              onClick={() => onCubeSelect(6)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[6].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[0, CUBE_Y_POSITION, CUBE_SPACING]}>
      
          <LanguageFloat index={7} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${7}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[7].topLeftText}
              bottomRightText={cubeTexts[7].bottomRightText}
              onClick={() => onCubeSelect(7)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[7].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
          <LanguageFloat index={8} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${8}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[8].topLeftText}
              bottomRightText={cubeTexts[8].bottomRightText}
              onClick={() => onCubeSelect(8)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[8].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <mesh
          position={[0, -1.5, 0]} // adjust Y to match cube base
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={1}
          scale={[6.5, 6.5, 1]} // covers the grid area
        >
          <planeGeometry args={[3.2, 3.0]} />
          <meshBasicMaterial
            map={shadowTexture}
            transparent={true}
            opacity={0.8}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      </>
    )
  }

  const sections = [
    { position: [0, 0, 0], lookAt: [0, 0, 0] },
    { position: [0, -10, 5], lookAt: [0, -10, 0] },
    { position: [5, -20, 5], lookAt: [0, -20, 0] }
  ]

  export default function InteractiveCubesScene({ isMapMode, onCubeClick }) {

    const { gl } = useThree();
    const [selectedCube, setSelectedCube] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('de');
    const [initialAnimTrigger, setInitialAnimTrigger] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxContent, setLightboxContent] = useState(null);
    const [lightboxType, setLightboxType] = useState('image');
    const [panelRemoved, setPanelRemoved] = useState(false);
    const [videoReadyToShow, setVideoReadyToShow] = useState(false);

    const timeoutRef = useRef(null); 
    const videoRefCallback = useRef(null);
    const videoRefForPause = useRef(null);
    const cubeRefs = useRef([]);
    const scroll = useScroll()
    const { camera } = useThree()
    const groupRef = useRef()
    
    useFrame(() => {
        if (!isMapMode) return
        
        // Vertical scroll effect
        const yOffset = scroll.offset * 30
        camera.position.set(0, 15 - yOffset, 3)
        camera.lookAt(0, 15 - yOffset - 5, 0)
        
        if (groupRef.current) {
          groupRef.current.position.y = yOffset
        }
      })
    


    const handleCubeSelect = (index) => {
      setSelectedCube(index);
      onCubeClick(index);
      // Lightbox functionality kept but not triggered here
    };

    const handleCloseEditor = () => {
      setSelectedCube(null)
    }

    const handleLanguageSwitch = () => {
      setActiveLanguage(prev => 
        prev === 'en' ? 'de' : 
        prev === 'de' ? 'fr' : 
        'en'
      );
    }
const openLightbox = (content, type = 'image') => {
    setLightboxContent(content)
    setLightboxType(type)
    setLightboxOpen(true)
    setSelectedCube(null); // Trigger fade-out
  }

 

  

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxContent(null)
    setLightboxType(null)
  }

  useEffect(() => {
    const video = videoRefCallback.current;
    if (video) {
      video.addEventListener('canplaythrough', () => {
        setVideoReadyToShow(true);
      });
    }
  }, [videoRefCallback]);

  useEffect(() => {
    cubeRefs.current.forEach(cube => {
      if (cube) cube.triggerAnimation();
    });
  }, [activeLanguage]);

  useEffect(() => {
    setInitialAnimTrigger(1);
    const timer = setTimeout(() => setInitialAnimTrigger(0), 100);
    return () => clearTimeout(timer);
  }, []);

  const getCubeTextsForLanguage = (lang) => {
    if (lang === 'de') return germanCubes;
    if (lang === 'fr') return frenchCubes;
    return englishCubes;
  };

  const cubeTexts = getCubeTextsForLanguage(activeLanguage);

    return (
      <group >
    
          <CubeLayout onCubeSelect={handleCubeSelect} activeLanguage={activeLanguage} />

          {/* Editor UI */}
          {(!panelRemoved && selectedCube !== null) && (
            <Html
                
                className="html-panel"
                calculatePosition={(el, camera, size) => {
                const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
                return [isMobile ? size.width / 2 - 230 : size.width / 2 - 235, 80];
                }}
                style={{
                width: '420px',
                pointerEvents: lightboxOpen ? 'none' : 'auto', // Disable interactions when fading
                touchAction: lightboxOpen ? 'none' : 'auto',
                zIndex: 1000,
                transition: 'opacity 1.5s ease-in-out',
                opacity: selectedCube !== null ? 1 : 0 // Fade out when selectedCube is null
                }}
            >
 
            <div  
               style={{
                 position: 'relative',
                 top: '0',
                 left: '50%',
                 transform: 'translate(-50%, 0)',
                 width: '420px',
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
                   borderRadius: '11px',
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
                      marginBottom: '5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'InterDisplay-Bold, sans-serif'
                    }}>
                      <div style={{ fontSize: '1.2em' }}>
                        {cubeTexts[selectedCube].topLeftText}
                      </div>
                      <div 
                        onClick={handleLanguageSwitch}
                        style={{ 
                          fontSize: '0.8em', 
                          color: '#fff', 
                          fontFamily: 'InterDisplay-ExtraLight, sans-serif',
                          marginLeft: '100px',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                          display: 'flex',
                          gap: '0.5em',
                        }}
                      >
                        {['EN', 'DE', 'FR'].map((lang, idx) => {
                          // Determine language code for comparison
                          const code = lang.toLowerCase();
                          // For cycling order
                          let displayOrder;
                          if (activeLanguage === 'en') displayOrder = ['DE', 'FR', 'EN'];
                          else if (activeLanguage === 'de') displayOrder = ['EN', 'FR', 'DE'];
                          else displayOrder = ['EN', 'DE', 'FR'];
                          const displayLang = displayOrder[idx];
                          const codeForDisplay = displayLang.toLowerCase();
                          return (
                            <span
                              key={displayLang}
                              style={{
                                color: activeLanguage === codeForDisplay ? '#f57500' : '#fff',
                                fontWeight: activeLanguage === codeForDisplay ? 'bold' : 'normal',
                                textShadow: activeLanguage === codeForDisplay ? '0 0 4px #f57500' : undefined
                              }}
                            >
                              {displayLang}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.0em', color: '#aaa', fontFamily: 'InterDisplay-Bold, sans-serif', marginBottom: '22px',}}>
                        {cubeTexts[selectedCube].bottomRightText}
                      </div>
                    
                    {/* Text content with perfect paragraph handling */}
                    <div style={{
                      flex: 1,
                      overflowY: 'auto',
                      paddingRight: '8px',
                      whiteSpace: 'pre-line',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      fontFamily: 'InterDisplay-ExtraLight, sans-serif',
                      fontSize: '1.3em',
                    }}>
                      {cubeTexts[selectedCube].description.split('\n\n').map((paragraph, i) => (
                        <p key={i} style={{ 
                          marginBottom: '1em',
                          lineHeight: '1.4'
                        }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  
                    {cubeTexts[selectedCube].images && (
                      <button
                        onClick={() => openLightbox(cubeTexts[selectedCube].images, 'image')}
                        style={{
                          width: '100%',
                          padding: '15px',
                          backgroundColor: '#f57500',
                          border: 'none',
                          borderRadius: '11px',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          margin: '10px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                        </svg>
                        View Gallery
                      </button>
                    )}
                    
                    {(cubeTexts[selectedCube].htmlUrl || cubeTexts[selectedCube].externalUrl) && (
                      <button
                        onClick={() => {
                          const url = cubeTexts[selectedCube].htmlUrl || cubeTexts[selectedCube].externalUrl;
                          setLightboxContent(url);
                          setLightboxType('iframe');
                          setLightboxOpen(true);
                        }}
                        style={{
                          width: '100%',
                          padding: '15px',
                          backgroundColor: '#f57500',
                          border: 'none',
                          borderRadius: '11px',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          margin: '10px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Open URL
                      </button>
                    )}
                    
                    {cubeTexts[selectedCube].videoUrl && (
                      <button
                        onClick={() => openLightbox(cubeTexts[selectedCube].videoUrl, 'video')}
                        style={{
                          width: '100%',
                          padding: '15px',
                          backgroundColor: '#f57500',
                          border: 'none',
                          borderRadius: '11px',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          margin: '10px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                        </svg>
                        View Video
                      </button>
                    )}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseEditor();
                      }}
                      style={{ 
                        marginTop: '11px',
                        padding: '15px',
                        backgroundColor: '#404040',
                        border: 'none',
                        borderRadius: '11px',
                        cursor: 'pointer',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        width: '100%',
                        pointerEvents: 'auto',
                        touchAction: 'auto',
                        WebkitTapHighlightColor: 'transparent',
                        zIndex: '3000',
                      }}
                    >
                      Close
                    </button>
                  </div>
                  </div>
                </Html>
              )}
      {/* Lightbox */}
      {lightboxOpen && (
        <Html
          fullscreen
          portal="lightbox-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'auto',
            zIndex: 999999
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click-through
        >
          <Lightbox 
            content={lightboxContent}
            onClose={closeLightbox}
            type={lightboxType}
            isOpen={lightboxOpen}
          />
        </Html>
      )}
            {showVideo && (
         <group position={[0, 3, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
    <VideoPlayerPlane 
 
      
      videoUrl={videoUrl2}
      isPlaying={showVideo}
      onClose={() => setShowVideo(false)}
    />
    </group>
  )}     
   {showVideo && (
    <group position={[0, 3, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
        <VideoPlayerPlane 
        videoUrl={videoUrl2}
        isPlaying={showVideo}
        onClose={() => setShowVideo(false)}
        />
        </group>
        )}

       
      </group>
    );
  }

