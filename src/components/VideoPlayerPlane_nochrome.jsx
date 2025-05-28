import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import VideoGammaMaterial from './VideoGammaMaterial';


const VideoPlayerPlane = ({ position, 
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
  const [isMobile, setIsMobile] = useState(false);
  //const [videoUrl2, setVideoUrl] = useState('/videos/Reel2025_May26c.mp4');

  // handle video reset
  useEffect(() => {
    if (videoElement) {
      videoElement.currentTime = 0;
      if (isPlaying) {
        videoElement.play().catch(e => console.error('Error playing video:', e));
      }
    }
  }, [resetTrigger, videoElement, isPlaying]);
  

  // 16:9 aspect ratio
  // Set up responsive dimensions
  const { width, height } = useMemo(() => {
    return isMobile 
      ? { width: 6, height: 3.375 }  // 16:9 aspect ratio for mobile
      : { width: 8.8, height: 4.8 };   // Larger for desktop
  }, [isMobile]);

  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Match the MOBILE_BREAKPOINT from ICS_C
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Video element creation with delay
  useEffect(() => {
    if (!videoUrl2 || !isPlaying) {
      setVideoElement(null);
      return;
    }
  
    const vid = document.createElement('video');
    vid.src = videoUrl2;
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    vid.muted = true; // Start muted for mobile autoplay
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', '');
    vid.style.position = 'absolute';
    vid.style.top = '-9999px'; // Hide but keep in DOM
    document.body.appendChild(vid);
  
    const handleFirstInteraction = () => {
      if (enableAudio) {
        vid.muted = false;
        vid.volume = 1.0;
      }
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  
    // Try to autoplay muted (which should work)
    const playPromise = vid.play().catch(e => {
      console.log('Autoplay prevented, waiting for interaction');
      // Wait for user interaction
      document.addEventListener('touchstart', handleFirstInteraction, { once: true });
      document.addEventListener('click', handleFirstInteraction, { once: true });
    });
  
    setVideoElement(vid);
  
    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      vid.pause();
      vid.remove();
    };
  }, [videoUrl2, isPlaying, enableAudio]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !isPlaying) return null;

  return (
    <group ref={groupRef} position={position || [0, 0, 0]}>
      {/* Video Plane */}
      <mesh position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}>
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
      
      {/* Close Button */}
      <mesh 
        position={[width/2 + 0.3, height/2 - 0.3, 0.1]} 
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      >
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#f57500" />
      </mesh>
      <Text
        position={[width/2 + 0.25, height/2 - 0.32,0.2]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      >
        ×
      </Text>
    </group>
  );
};


export default VideoPlayerPlane;