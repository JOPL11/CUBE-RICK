'use client'
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { CAMERA_SETTINGS } from '../config/cameraSettings';

export default function DebugCamera() {
  const { camera } = useThree();
  
  useEffect(() => {
    if (!camera) return;
    
    const logCamera = () => {
      console.log('Camera Debug:',
        `CONFIG Y: ${CAMERA_SETTINGS.default.position[1]}`,
        `ACTUAL Y: ${camera.position.y.toFixed(1)}`,
        `FOV: ${camera.fov}`,
        `Looking at: (${camera.rotation.x.toFixed(2)}, ${camera.rotation.y.toFixed(2)}, ${camera.rotation.z.toFixed(2)})`);
    };
    
    logCamera();
    const interval = setInterval(logCamera, 3000);
    return () => clearInterval(interval);
  }, [camera]);
  
  return null;
}
