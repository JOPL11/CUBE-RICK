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

const CameraController = forwardRef(({ onStateChange }, ref) => {
  const { camera, controls } = useThree();
  
  // [Original camera implementation]
  const animateToTopDown = () => {
    if (!camera) return;
    
    gsap.to(camera.position, {
      y: CAMERA_SETTINGS.topDown.positionY,
      duration: CAMERA_SETTINGS.topDown.transitionDuration,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, CAMERA_SETTINGS.topDown.lookAtY, 0)
    });
  };

  const flyToTarget = (target) => {
    if (!camera) return;
    
    gsap.to(camera.position, {
      y: CAMERA_SETTINGS.topDown.positionY,
      z: target.z,
      duration: target.duration,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, target.lookAtY, 0)
    });
  };

  useImperativeHandle(ref, () => ({
    animateToTopDown,
    flyToTarget
  }));

  return null;
});

export default CameraController;
