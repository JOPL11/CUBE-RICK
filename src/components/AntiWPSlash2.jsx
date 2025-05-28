'use client'
import { useEffect, useState } from 'react';

const AntiWPSplash = () => {
  const [visible, setVisible] = useState(true);
  const [languageSelected, setLanguageSelected] = useState(false);

  useEffect(() => {
    if (languageSelected) {
      const timer = setTimeout(() => setVisible(false), 4500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [languageSelected]);


  const handleLanguageSelect = (lang) => {
    // Normalize language selection to ensure consistent mapping
    const normalizedLang = {
      'EN': 'en',
      'FR': 'fr',
      'DE': 'de'
    }[lang.toUpperCase()] || 'en';

    console.group('Language Selection Process');
    console.log('Raw Language Input:', lang);
    console.log('Normalized Language:', normalizedLang);
    
    // Trigger global language switcher directly
    if (window.globalHandleLanguageSwitcheroo) {
      console.log('Calling global language switcher');
      window.globalHandleLanguageSwitcheroo(normalizedLang);
    }
    
    // Safe fullscreen request with mobile and error handling
    const requestFullscreenSafely = () => {
        try {
          if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen()
              .then(() => console.log('Fullscreen enabled'))
              .catch((err) => {
                console.warn('Fullscreen request failed:', err);
                // Handle specific error types if needed
              });
          }
        } catch (error) {
          console.error('Fullscreen request error:', error);
        }
      };

    // Use setTimeout to ensure this runs after React render
   // setTimeout(requestFullscreenSafely, 3000);
    
    setLanguageSelected(true);
    console.log('Language Selection Complete');
    console.groupEnd();
  };
  const handleAnimationEnd = () => {
    setVisible(false);
  };

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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'InterDisplay-ExtraLight, sans-serif',
      fontSize: 'clamp(11px, 2vw, 18px)',
      animation: languageSelected 
    ? 'fadeOut 2.5s ease-out 2s forwards' 
    : 'none',
    pointerEvents: languageSelected ? 'none' : 'auto',
    cursor: languageSelected ? 'none' : 'default'
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
        <p>Version 5.4</p>
        
        {!languageSelected && (
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <p style={{ fontFamily: 'InterDisplay-Bold, sans-serif'}}>
             Please select your preferred language: 
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button 
                onClick={() => handleLanguageSelect('en')}
                style={{
                  fontFamily: 'InterDisplay-Bold, sans-serif',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid gray',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                EN
              </button>
              <button 
                onClick={() => handleLanguageSelect('fr')}
                style={{
                  fontFamily: 'InterDisplay-Bold, sans-serif',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid gray',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                FR
              </button>
              <button 
                onClick={() => handleLanguageSelect('de')}
                style={{
                  fontFamily: 'InterDisplay-Bold, sans-serif',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid gray',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                DE
              </button>
            </div>
            <p style={{ fontFamily: 'InterDisplay-ExtraLight, sans-serif', marginTop: '1px', fontSize: 'clamp(13px, 2vw, 17px)' }}>
             Opens in fullscreen mode
            </p>
          </div>
        )}
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