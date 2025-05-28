import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import VideoGammaMaterial from './VideoGammaMaterial';

const VideoPlayerPlane = ({ 
  position, 
  videoUrl2, 
  onClose, 
  isPlaying = true, 
  resetTrigger = 0, 
  onClick, 
  enableAudio = false 
}) => {
  const groupRef = useRef();
  const [videoElement, setVideoElement] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 16:9 aspect ratio
  const { width, height } = useMemo(() => {
    return isMobile 
      ? { width: 6, height: 3.375 }  // 16:9 aspect ratio for mobile
      : { width: 8.8, height: 4.8 }; // Larger for desktop
  }, [isMobile]);

  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isPortrait = window.innerWidth < window.innerHeight;
      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Video element creation with mobile Chrome compatibility
  useEffect(() => {
    if (!videoUrl2 || !isPlaying) {
      setVideoElement(null);
      return;
    }

    const vid = document.createElement('video');
    const source = document.createElement('source');
    source.src = videoUrl2;
    source.type = 'video/mp4';
    vid.appendChild(source);

    // Mobile Chrome specific settings
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', '');
    vid.setAttribute('muted', !enableAudio ? 'muted' : '');
    vid.setAttribute('preload', 'auto');
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    
    if (enableAudio) {
      vid.volume = 1.0;
    }

    const handlePlayPromise = async () => {
      try {
        await vid.play();
        setNeedsInteraction(false);
      } catch (err) {
        console.log('Autoplay prevented, needs interaction:', err);
        setNeedsInteraction(true);
      }
    };

    // Add event listeners
    vid.addEventListener('loadedmetadata', handlePlayPromise);
    vid.addEventListener('touchstart', handlePlayPromise, { once: true });
    
    setVideoElement(vid);

    // Cleanup
    return () => {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
      vid.removeEventListener('loadedmetadata', handlePlayPromise);
      vid.removeEventListener('touchstart', handlePlayPromise);
    };
  }, [videoUrl2, isPlaying, enableAudio, resetTrigger]);

  const handleInteraction = async (e) => {
    e?.stopPropagation();
    
    if (!videoElement) return;
    
    try {
      if (videoElement.paused) {
        // On mobile, we need to explicitly enable audio after user interaction
        if (enableAudio && videoElement.muted) {
          videoElement.muted = false;
        }
        await videoElement.play();
        setNeedsInteraction(false);
      }
    } catch (err) {
      console.error('Error playing video:', err);
      setNeedsInteraction(true);
    }
    
    if (onClick) onClick(e);
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !isPlaying) return null;
  const myFont = '/fonts/InterDisplay-Regular.ttf';
  return (
    <group ref={groupRef} position={position || [0, 0, 0]}>
      {/* Video Plane */}
      <mesh 
        position={[0, 0, 0]}
        onClick={handleInteraction}
        {...(isMobile && { onTouchStart: handleInteraction })}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        <planeGeometry args={[width, height]} />
        {videoElement ? (
          <VideoGammaMaterial 
            map={new THREE.VideoTexture(videoElement)} 
            gamma={1.0} 
            transparent={true}
          />
        ) : (
          <meshBasicMaterial color="#000000" />
        )}
      </mesh>
      
      {/* Interaction prompt */}
      {needsInteraction && (
        <mesh 
          position={[0, 0, 0.01]} 
          onClick={handleInteraction}
          {...(isMobile && { onTouchStart: handleInteraction })}
        >
          <planeGeometry args={[width * 1.0, height * 1.0]} />
          <meshBasicMaterial color="black"  />
          <Text
            position={[0, -0.5, 0.01]}
            font={myFont}
            fontSize={isMobile ? 0.2 : 0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {isMobile ? 'Tap to play video' : 'Click to play video'}
          </Text>
        </mesh>
      )}

      {/* Close Button */}
      <mesh 
        position={[width/2 + 0.25, height/2 - 0.25, 0.1]} 
        onClick={handleClose}
      >
        <boxGeometry args={[0.35, 0.35, 0.1]} />
        <meshStandardMaterial color="#f57500" />
        <Text
          position={[-0.01, 0, 0.1]}
          font={myFont}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          ×
        </Text>
      </mesh>
    </group>
  );
};

export default VideoPlayerPlane;