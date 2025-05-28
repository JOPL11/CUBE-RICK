'use client'
import { createContext, useState, useEffect, useContext } from 'react'; 
import { useRef } from 'react';
import { theme } from '../config/theme';

export const ThemeContext = createContext();

const MOBILE_BREAKPOINT = 768; // Define the mobile breakpoint

export default function Header({ 
  darkMode, 
  setDarkMode, 
  onToggleCameraMode, 
  isMapMode, 
  handleLanguageSwitcheroo, 
  activeLanguage
}) {
  const [isThirdOpen, setIsThirdOpen] = useState(false);
  const [flexDirection, setFlexDirection] = useState('row'); // State to store flex direction
  const [isFullscreen, setIsFullscreen] = useState(() => {
    // Initialize state based on actual fullscreen status
    return !!document.fullscreenElement;
  });
  
// Language initialization without localStorage
useEffect(() => {
  // No more localStorage retrieval
  console.log('Language initialization without localStorage');
}, []);

  

  // Initialize language from localStorage if not provided
  useEffect(() => {
    if (!activeLanguage && handleLanguageSwitcheroo) {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage) {
        handleLanguageSwitcheroo(savedLanguage);
      }
    }
  }, []);

// Enhanced language change handler - removed localStorage
const changeLanguage = (lang) => {
  if (handleLanguageSwitcheroo) {
    handleLanguageSwitcheroo(lang);
  }
};

  useEffect(() => {
    const handleResize = () => {
      setFlexDirection(window.innerWidth < MOBILE_BREAKPOINT ? 'column' : 'row');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      {/* Logo Positioned Top Left */}
      <div style={{
        position: 'fixed',
        top: '30px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}>
        <img 
          src={darkMode ? "/images/logo2.png" : "/images/logo.png"} 
          alt="Logo" 
          style={{
            width: 'clamp(40px, 8vw, 60px)',
            height: 'auto',
            filter: darkMode 
              ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' 
              : 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
            transition: 'filter 0.3s ease'
          }}
        />
      </div>

      {/* Bottom Left Controls */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        alignItems: 'center'
      }}>
        {/* Camera Mode Toggle Button */}
        <button 
          onClick={onToggleCameraMode}
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: darkMode ? '0px solid rgba(255,255,255,0.2)' : '0px solid rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            flexShrink: 0
          }}
        >
          {isMapMode ? (
             <img src="/eye.svg" alt="Map Mode Icon" width="60" height="60" />
          ) : (
            <img src="/eye2.svg" alt="Map Mode Icon" width="60" height="60" />
          )}
        </button>

        {/* Light/Dark Mode Toggle */}
        <button 
          onClick={() => {
            setIsThirdOpen(!isThirdOpen);
            setDarkMode(!darkMode);
          }}
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: darkMode ? '0px solid rgba(255,255,255,0.2)' : '0px solid rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            flexShrink: 0
          }}
        >
          {isThirdOpen ? (
                <img src="/bulb.svg" alt="Map Mode Icon" width="60" height="60" />
            ) : (
              <img src="/bulb2.svg" alt="Map Mode Icon" width="60" height="60" />
            )}
        </button>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: darkMode ? '0px solid rgba(255,255,255,0.2)' : '0px solid rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            flexShrink: 0
          }}
        >
          {isFullscreen ? (
                <img src="/fullscreen2.svg" alt="Map Mode Icon" width="60" height="60" />
              ) : (
                <img src="/fullscreen.svg" alt="Map Mode Icon" width="60" height="60" />
              )}
        </button>
      </div>

      {/* Right-aligned Navigation Links */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: 'clamp(20px, 3vw + 10px, 50px)',
        zIndex: 1000,
        display: 'flex',
        gap: 'clamp(8px, 2vw, 20px)',
        alignItems: 'center',
        flexDirection: 'row' // Ensure horizontal layout
      }}>
        {/* Navigation buttons 
        <button  style={navButtonStyle(darkMode)}>
          <span style={{ fontFamily: 'InterDisplay-Bold, sans-serif', color: darkMode ? '#3d3d3d' : '#9d9d9d' }}>|</span>   About
        </button>*/}
        <button onClick={() => window.location.href = 'mailto:jan.peiro@protonmail.com'} style={navButtonStyle(darkMode)}>
          <span style={{ fontFamily: 'InterDisplay-Bold, sans-serif', color: darkMode ? '#3d3d3d' : '#9d9d9d' }}>|</span>  Contact
        </button>
        <button onClick={() => window.open('https://www.jopl.de/2/impressum.html', '_blank')} style={navButtonStyle(darkMode)}>
          <span style={{ fontFamily: 'InterDisplay-Bold, sans-serif', color: darkMode ? '#3d3d3d' : '#9d9d9d' }}>|</span>  Impressum
        </button>
      </div>

      {/* Language Switch */}
      <div style={{
            position: 'fixed',
            bottom: '20px',
            right: 'clamp(20px, 3vw + 30px, 50px)',
            zIndex: 1000,
            display: 'flex',
            gap: 'clamp(8px, 2vw, 20px)',
            alignItems: 'center',
            flexDirection: 'row'
      }}>
       <button 
          onClick={() => changeLanguage('en')} 
          style={{
            ...navButtonStyle(darkMode),
            color: activeLanguage === 'en' ? '#f57500' : (darkMode ? '#ffffff' : '#3d3d3d')
          }}>
          <span style={{ fontFamily: 'InterDisplay-Bold, sans-serif', color: darkMode ? '#3d3d3d' : '#9d9d9d' }}>|</span> EN
        </button>
        <button 
          onClick={() => changeLanguage('de')} 
          style={{
            ...navButtonStyle(darkMode),
            color: activeLanguage === 'de' ? '#f57500' : (darkMode ? '#ffffff' : '#3d3d3d')
          }}>
          <span style={{ fontFamily: 'InterDisplay-Bold, sans-serif', color: darkMode ? '#3d3d3d' : '#9d9d9d' }}>|</span> DE
        </button>
        <button 
          onClick={() => changeLanguage('fr')} 
          style={{
            ...navButtonStyle(darkMode),
            color: activeLanguage === 'fr' ? '#f57500' : (darkMode ? '#ffffff' : '#3d3d3d')
          }}>
          <span style={{ fontFamily: 'InterDisplay-Bold, sans-serif', color: darkMode ? '#3d3d3d' : '#9d9d9d' }}>|</span> FR
        </button>
      </div>
    </ThemeContext.Provider>
  );
}

// Helper function for navigation button styles
const navButtonStyle = (darkMode) => ({
  background: 'transparent',
  color: darkMode ? '#fff' : '#4d4d4d',
  border: 'none',
  fontSize: 'clamp(16px, 1.2vw, 18px)',
  cursor: 'pointer',
  textDecoration: 'none',
  fontFamily: 'InterDisplay-Regular, sans-serif',
  padding: '6px 0',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  ':hover': {
    textDecoration: 'underline'
  }
});