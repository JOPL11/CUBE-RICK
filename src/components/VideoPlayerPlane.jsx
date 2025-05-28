import { useEffect, useRef, useState, useMemo } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  // Handle video play on user interaction
  const handlePlay = () => {
    if (videoElement) {
      // Enable audio and unmute when user interacts
      videoElement.muted = false;
      if (enableAudio) {
        videoElement.volume = 1.0;
      }
      videoElement.play().catch(e => console.error('Error playing video:', e));
      setShowPlayButton(false);
      setUserInteracted(true);
    }
  };

  // handle video reset
  useEffect(() => {
    if (videoElement && userInteracted) {
      videoElement.currentTime = 0;
      if (isPlaying) {
        videoElement.play().catch(e => console.error('Error playing video:', e));
      }
    }
  }, [resetTrigger, videoElement, isPlaying, userInteracted]);
  
  // 16:9 aspect ratio
  const { width, height } = useMemo(() => {
    return isMobile 
      ? { width: 6, height: 3.375 }  // 16:9 aspect ratio for mobile
      : { width: 8.8, height: 4.8 };   // Larger for desktop
  }, [isMobile]);

  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileCheck = window.innerWidth < 768;
      setIsMobile(isMobileCheck);
      // On mobile, we'll show the play button by default
      if (isMobileCheck) {
        setShowPlayButton(true);
      }
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
    vid.muted = !enableAudio;
    vid.playsInline = true;
    vid.setAttribute('webkit-playsinline', 'webkit-playsinline');
    
    if (enableAudio) {
      vid.volume = 1.0;
    }
    
    // Try to autoplay if not on mobile or if audio is enabled
    if (!isMobile || enableAudio) {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay failed, show play button
          setShowPlayButton(true);
        });
      }
    }
    
    setVideoElement(vid);

    return () => {
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
        if (vid.src) {
          vid.removeAttribute('src');
          vid.load();
        }
      }
    };
  }, [videoUrl2, isPlaying, enableAudio, isMobile]);

  // Cleanup video on unmount or when video changes
  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.muted = true; // Mute when cleaning up
        if (videoElement.src) {
          videoElement.removeAttribute('src');
          videoElement.load();
        }
      }
    };
  }, [videoElement]);

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    // Stop video and audio
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.muted = true;
    }
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={position || [0, 0, 0]}>
      {/* Video Plane */}
      <mesh 
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
          if (showPlayButton) {
            handlePlay();
          }
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <planeGeometry args={[width, height]} />
        {videoElement ? (
          <VideoGammaMaterial 
            map={new THREE.VideoTexture(videoElement)} 
            gamma={1} 
            transparent={false}
          />
        ) : (
          <meshStandardMaterial color="#000000" />
        )}
        
        {/* Play button overlay */}
        {showPlayButton && (
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial color="rgba(0,0,0,0)" />
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              ▶
            </Text>
          </mesh>
        )}
      </mesh>
      
      {/* Close Button */}
      <mesh 
        position={[width/2 + 0.3, height/2 - 0.3, 0.1]} 
        onClick={handleClose}
      >
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshStandardMaterial color="#f57500" />
      </mesh>
      <Text
        position={[width/2 + 0.25, height/2 - 0.32, 0.2]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        onClick={handleClose}
      >
        ×
      </Text>
    </group>
  );
};

export default VideoPlayerPlane;