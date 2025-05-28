'use client'
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { CAMERA_SETTINGS, FLY_TARGETS } from '../config/cameraSettings';
import { forwardRef, useImperativeHandle } from 'react';

// Modern debug logging that won't clutter chat
const debugLog = (message) => {
  console.log('%cCAMERA DEBUG:', 'color: #4CAF50; font-weight: bold', message);
  // Optional: Filterable browser logs
  window.cameraDebug = window.cameraDebug || [];
  window.cameraDebug.push(message);
};

const CameraController = forwardRef(({ isMapMode }, ref) => {
  const { camera } = useThree();
  
  console.log('[CameraController Component] Component mounted', {
    camera: !!camera,
    isMapMode
  });
  
  useImperativeHandle(ref, () => ({
    flyToTarget: (target) => {
      console.log('[CameraController Component] Fly to target called:', {
        target,
        camera: !!camera
      });
      
      if (!camera) {
        console.log('[CameraController Component] Camera not available');
        return;
      }
      
      console.log('[CameraController Component] Starting animation:', {
        from: camera.position,
        to: {
          z: target.z,
          y: CAMERA_SETTINGS.topDown.positionY
        }
      });
      
      gsap.to(camera.position, {
        y: CAMERA_SETTINGS.topDown.positionY,
        z: target.z,
        duration: target.duration,
        ease: "power2.inOut",
        onUpdate: () => {
          console.log('[CameraController Component] Camera position:', camera.position);
          camera.lookAt(0, target.lookAtY, 0);
        }
      });
    }
  }));

  return null;
});

export default CameraController;
