'use client'

export const CAMERA_SETTINGS = {
  // Default View
  default: {
    position: [0, 16, 0],
    fov: 38,
    lookAt: [0, 0, 0],
    near: 0.1,
    far: 1000
  },
  
  // Top-Down View
  topDown: {
    positionY: 16,
    lookAtY: 8,
    transitionDuration: 1.2,
    flyToZ: -300,
    flyDuration: 2
  },
  
  // Animation
  animation: {
    initialPosition: [0, 16, 0],
    finalZ: 5,
    orbitRadius: 15,
    duration: 6
  },
  
  // OrbitControls
  controls: {
    minPolarAngle: 0.1,
    maxPolarAngle: Math.PI / 1.8,
    minDistance: 3,
    maxDistance: 14,
    smoothTime: 0.1
  },
  
  // Fly targets for cube buttons
  FLY_TARGETS: {
    button4: {
      
      z: 200,
      duration: 2,
      lookAtY: 8
    }
  }
  
};
