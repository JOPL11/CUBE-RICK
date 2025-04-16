'use client'
import { useEffect, useState } from 'react';

const AntiWPSplash = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500); // Disappears after 1.5s
    return () => clearTimeout(timer);
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
      fontFamily: 'sans-serif',
      fontSize: 'clamp(12px, 2vw, 16px)',
      animation: 'fadeOut 0.5s ease-out 1s forwards'
    }}>
      <p>No WordPress users were harmed in the making of this website.</p>
      <style jsx>{`
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AntiWPSplash;