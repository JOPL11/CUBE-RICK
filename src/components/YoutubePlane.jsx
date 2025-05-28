import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Text, Html } from '@react-three/drei';
import YouTube from 'react-youtube';
import { RoundedBox } from '@react-three/drei';

const VideoPlayerPlane = ({ 
    position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  videoUrl2, 
  onClose, 
  isPlaying = true, 
  resetTrigger = 0, 
  onClick, 
  enableAudio = false 
}) => {
  const groupRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [player, setPlayer] = useState(null);

  // Extract YouTube video ID from URL
  useEffect(() => {
    if (!videoUrl2) return;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl2.match(regExp);
    
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
    }
  }, [videoUrl2]);

  // Handle play/pause when isPlaying changes
  useEffect(() => {
    if (!player) return;
    
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, player]);

  // Handle reset
  useEffect(() => {
    if (player && isPlaying) {
      player.seekTo(0);
      player.playVideo();
    }
  }, [resetTrigger, player, isPlaying]);

  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // 16:9 aspect ratio
  const { width, height } = useMemo(() => {
    return isMobile 
      ? { width: 6, height: 3.375 }  // 16:9 aspect ratio for mobile
      : { width: 8.5, height: 4.8 };   // Larger for desktop
  }, [isMobile]);

  // YouTube player options
  const opts = useMemo(() => ({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 0,
      fs: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      mute: enableAudio ? 0 : 1,
      playsInline: 1,
    controls: 1,
    playlist: 'WGGgQzQwH54,9F9U-nmoVw0',
    loop: 1  // Will loop through all videos
    },
  }), [enableAudio]);

  const onPlayerReady = (event) => {
    setPlayer(event.target);
    if (isPlaying) {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };

  if (!isVisible || !isPlaying || !videoId) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Video Plane */}
      <mesh 
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <RoundedBox args={[width, height, 0.1]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#3d3d3d">
          <Html
            center
            transform
            distanceFactor={1}
            position={isMobile ? [0, 4.75, 1.5] : [0, 6.0, 1.5]}  // Slight Z-offset to be on top
            rotation={isMobile ? [-Math.PI / 2.3, 0, -Math.PI / 2] : [-Math.PI / 2.37, 0, 0]} 
            scale={isMobile ? [0.55, 0.55, 0.55] : [1, 1, 1]}
            style={{
                width: '1920px',  // Standard HD width
                height: '1080px', // Standard HD height
                transform: 'scale(1.7)', // Adjust this value to match your desired size
                transformOrigin: 'center',
                pointerEvents: 'none',
                overflow: 'hidden',
                imageRendering: 'crisp-edges',
                borderRadius: '40px',   
                backfaceVisibility: 'hidden',
            }}
          >
            <div style={{
             width: '100%',
             height: '100%',
             position: 'relative',
             transform: 'scale(1)',
             transformOrigin: 'center',
             pointerEvents: 'none',
             imageRendering: 'crisp-edges'
            }}>
              <YouTube
                videoId={videoId}
                opts={{
                    ...opts,
                    width: '1920',
                    height: '1080'
                  }}
                onReady={onPlayerReady}
                onPlay={() => console.log('YouTube video playing')}
                onPause={() => console.log('YouTube video paused')}
                onError={(e) => console.error('YouTube player error', e)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  pointerEvents: 'auto'
                }}
              />
            </div>
          </Html>
          <Html
                position={[0, -height/2 - 0.1, 1]}  // Positioned below the video
                rotation={isMobile ? [-Math.PI / 2.3, 0, -Math.PI / 2] : [-Math.PI / 2.37, 0, 0]} 
                transform
                center
                style={{
                    color: 'white',
                    fontFamily: 'InterDisplay-ExtraLight, sans-serif',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
                >
                Loading video...
                </Html>
        </meshStandardMaterial >
        </RoundedBox>
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
        position={[width/2 + 0.25, height/2 - 0.32, 0.2]}
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