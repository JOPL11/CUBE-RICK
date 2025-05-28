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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
       <img 
          src="/images/logo2.png" 
          style={{
            width: 'clamp(50px, 8vw, 120px)', 
            height: 'auto', 
            filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))', 
            transition: 'filter 0.3s ease'
          }} 
          alt="Logo" 
        />
      <p>Version 5.83</p>
      <p></p>
      </div>
      <style jsx>{`
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AntiWPSplash;