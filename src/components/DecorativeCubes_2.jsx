'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { useContext } from 'react';
import { ThemeContext } from './Header';


// Register GSAP plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin)
}

const DecorativeCubes2 = ({ color = "#f57500" }) => {
  const theme = useContext(ThemeContext);
  const effectiveColor = theme.decorativeCubes;

  const [initialized, setInitialized] = useState(false);
  const numCubes = 25
  const cubesRef = useRef([])
  const animationRef = useRef({
    count: 0,
    targets: [],
    tweens: []
  })
  const shadowRefs = useRef([]);

  // Shadow texture
  const shadowTexture = useLoader(TextureLoader, '/images/shadows.png')

  // Exclusion Zone. 
  useEffect(() => {
    animationRef.current.targets = Array.from({ length: numCubes }, () => {
      let x, z
      do {
        x = (Math.random() - 0.5) * 15
        z = (Math.random() - 0.5) * 15
      } while ((Math.abs(x) < 5 && Math.abs(z) < 7))
      
      return {
        x,
        y: 0.2 + Math.random() * 0.5,
        z,
        scale: 0.5 + Math.random() * 2.5
      }
    })
    setInitialized(true);
  }, [])

  useEffect(() => {
    const updateShadows = () => {
      cubesRef.current.forEach((cube, i) => {
        if (cube && shadowRefs.current[i]) {
          shadowRefs.current[i].position.x = cube.position.x;
          shadowRefs.current[i].position.z = cube.position.z;
          shadowRefs.current[i].scale.set(cube.scale.x * 1.3, cube.scale.z * 1.3, 1);
        }
      });
      requestAnimationFrame(updateShadows);
    };
    updateShadows();
    
    return () => cancelAnimationFrame(updateShadows);
  }, []);

  if (!initialized) return null;

  // Animation methods
  const animateBounce = (cube, target) => {

    return gsap.timeline()
      .to(cube.position, {
        x: target.x,
        y: target.y + 2,
        z: target.z,
        duration:3,
        ease: "elastic.out",
        immediateRender: false,

        
      }  )
      .to(cube.position, {
        y: target.y,
        duration: 5,
        ease: "elastic.out",
        immediateRender: false,
      
      } )
  }

  const animateCurved = (cube, target) => {
    const start = { ...cube.position }
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(
        (start.x + target.x) / 2,
        Math.max(Math.abs(start.x - target.x), Math.abs(start.z - target.z)) / 2,
        (start.z + target.z) / 2
      ),
      new THREE.Vector3(target.x, target.y, target.z)
    )

    return gsap.to(cube.position, {
      duration: 2,
      ease: "sine.inOut",
      motionPath: {
        path: curve.getPoints(20).map(p => ({ x: p.x, y: p.y, z: p.z })),
        curviness: 0,
        stagger: {
          each: 0.2, // Time between starts
          amount: 0.5, // Total duration of stagger
          from: "center", // Animation direction
          axis: "x", // Stagger direction
          ease: "power2.inOut" // Per-item easing
        }
      },
      immediateRender: false
    })
  }

  const animateSpiral = (cube, target) => {
    const start = { ...cube.position }
    return gsap.to(cube.position, {
      x: target.x,
      z: target.z,
      duration: 1,
      ease: "elastic.inOut",
      modifiers: {
        y: () => {
          const progress = gsap.getProperty(cube.position, "progress") || 0
          const distance = Math.hypot(target.x - start.x, target.z - start.z)
          return start.y + Math.sin(progress * Math.PI * 2) * (distance * 0.9)
        }
      },
      immediateRender: true
    })
  }

  // Helper function to check if a point is in the exclusion zone
  const isInExclusionZone = (x, z) => {
    const exclusionRadiusX = 6;
    const exclusionRadiusZ = 8;
    return Math.abs(x) < exclusionRadiusX && Math.abs(z) < exclusionRadiusZ;
  };

  // Updated animateCubes to include zone enforcement
  const animateCubes = () => {
    // First validate ALL targets are outside zone
    animationRef.current.targets = animationRef.current.targets.map(target => {
      if (isInExclusionZone(target.x, target.z)) {
        return {
          ...target,
          x: target.x < 0 ? -6.1 : 6.1,
          z: target.z < 0 ? -8.1 : 8.1
        };
      }
      return target;
    });

    if (!cubesRef.current) return;

    // Kill existing tweens
    animationRef.current.tweens.forEach(tween => tween?.kill());
    animationRef.current.tweens = [];

    // Generate new targets and animate
    animationRef.current.targets = generateNewTargets();
    cubesRef.current.forEach((cube, i) => {
      if (!cube || !animationRef.current.targets[i]) return;

      const target = animationRef.current.targets[i];
      const posTween = (() => {
        switch (animationRef.current.count % 3) {
          case 0: return animateBounce(cube, target);
          case 1: return animateCurved(cube, target);
          case 2: return animateSpiral(cube, target);
        }
      })();

      const scaleTween = gsap.to(cube.scale, {
        x: target.scale,
        y: target.scale,
        z: target.scale,
        duration: 2,
        ease: ["elastic.inOut", "sine.inOut", "elastic.out(1.7)"][animationRef.current.count % 3],
      });

      animationRef.current.tweens.push(posTween, scaleTween);

      // After the main animation, check for zone violations
      posTween.then(() => {
        const offenders = checkExclusionZone();
        if (offenders.length > 0) {
          expelFromZone(offenders);
        }
      });
    });

    animationRef.current.count++;
  };

  const generateNewTargets = () => {
    return animationRef.current.targets.map(current => {
      let x, z;
      let attempts = 0;
      const maxAttempts = 20;
      const worldBoundaryX = 7.5;
      const worldBoundaryZ = 22.5;
      
      do {
        x = current.x + (Math.random() - 0.5) * 6;
        z = current.z + (Math.random() - 0.5) * 25;
        
        // Apply original boundaries
        x = Math.max(-worldBoundaryX, Math.min(worldBoundaryX, x));
        z = Math.max(-worldBoundaryZ/2, Math.min(worldBoundaryZ, z));
        
        // Only enforce exclusion zone
        if (Math.abs(x) < 6 && Math.abs(z) < 8) {
          x = x < 0 ? -6.1 : 6.1;
          z = z < 0 ? -8.1 : 8.1;
        }
        
        attempts++;
      } while (attempts < maxAttempts && Math.abs(x) < 6 && Math.abs(z) < 8);
      
      return {
        x,
        y: 0.2 + Math.random() * 0.5,
        z,
        scale: Math.max(0.5, Math.min(3, current.scale + (Math.random() - 0.5) * 1.5))
      };
    });
  };

  const checkExclusionZone = () => {
    return cubesRef.current.reduce((offenders, cube, i) => {
      if (cube) {
        const { x, z } = cube.position
        if (Math.abs(x) < 5 && Math.abs(z) < 12) { 
          offenders.push(i)
        }
      }
      return offenders
    }, [])
  };

  const expelFromZone = (offenderIndices) => {
    offenderIndices.forEach((i) => {
      const cube = cubesRef.current[i]
      if (!cube) return

      let x, z
      const minExpelDistanceZ = 15 
      do {
        x = (Math.random() - 0.5) * 15
        z = (Math.random() - 0.5) * 30 
      } while (Math.abs(x) < 5 && Math.abs(z) < minExpelDistanceZ)

      const target = { 
        x, 
        y: 0.2 + Math.random() * 0.5,
        z,
        scale: cube.scale.x,
        rotation: [0,2,0] 
      }

      const tween = animateBounce(cube, target)
      animationRef.current.tweens.push(tween)
    })
  };

  return (
    <>
      <ambientLight intensity={1.0} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      
      {animationRef.current.targets.map((pos, i) => (
        <Float 
          key={i} 
          speed={1 + Math.random() * 2} 
          rotationIntensity={0.1} 
          floatIntensity={0.1}
        >
          {/* Shadow beneath the cube, fixed at y = -1.5, using animation target position/scale only */}
          <mesh
            ref={el => shadowRefs.current[i] = el}
            position={[pos.x, -1.5, pos.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
            scale={[1.3 * pos.scale, 1.3 * pos.scale, 1]}
          >
            <planeGeometry args={[1.2, 1.2]} />
            <meshBasicMaterial
              map={shadowTexture}
              transparent={true}
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>
          <mesh 
            renderOrder={2}
            ref={el => cubesRef.current[i] = el} 
            position={[pos.x, pos.y, pos.z]} 
            scale={[pos.scale, pos.scale, pos.scale]}
            onClick={() => {
              if (!cubesRef.current || cubesRef.current.some(c => !c)) {
                console.warn('Cubes not initialized yet');
                return;
              }
              animateCubes();
            }}
          >
            <RoundedBox 
              args={[0.7, 0.15, 0.7]} 
              radius={0.05}  
              smoothness={4} 
            >
            {/*<boxGeometry args={[0.5, 0.5, 0.5]} />*/}
            {/*<sphereGeometry args={[0.50, 33, 33]} /> radius, widthSegments, heightSegments */}
            <meshStandardMaterial 
              color={effectiveColor}
              metalness={0.1}
              roughness={0.3}
              
              emissiveIntensity={0.2}
              depthTest={true} 
              depthWrite={true} 
            />
                  </RoundedBox>
          </mesh>
    
        </Float>
      ))}
    </>
  )
};

export default DecorativeCubes2