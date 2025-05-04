'use client'
import { useEffect, useState } from 'react';

const AntiWPSplash = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000); // Disappears after 2.5s
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Font available?', document.fonts.check('1em InterDisplay-Bold'));
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'InterDisplay-Bold, sans-serif',
      fontSize: 'clamp(12px, 2vw, 16px)',
      animation: 'fadeOut 2.5s ease-out 2s forwards',
      pointerEvents: 'none' 
    }}>
      <p>Version 4.5</p>
      <style jsx>{`
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AntiWPSplash;