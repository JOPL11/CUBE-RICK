'use client'

import { createContext, useState } from 'react';
import { theme } from '../config/theme';
import { Html } from '@react-three/drei'

export const ThemeContext = createContext();

export default function Header({ darkMode, setDarkMode, fogEnabled, setFogEnabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isThirdOpen, setIsThirdOpen] = useState(false);

  return (

    <ThemeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <div style={{
        position: 'fixed',
        bottom: '40px',  
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Fog Toggle Button 
        <button 
          onClick={() => setFogEnabled(!fogEnabled)}
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {fogEnabled ? 'FOG ON' : 'FOG OFF'}
        </button>
*/}
        {/* Lightbulb Button */}
        <button 
          onClick={() => {
            setIsThirdOpen(!isThirdOpen);
            setDarkMode(!darkMode);
          }}
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isThirdOpen ? (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="10" r="6.5" fill="white"/>
              <rect x="9" y="16" width="6" height="5" rx="1.5" fill="#6c6c6d"/>
              <rect x="11" y="21" width="2" height="1.2" rx="0.6" fill="#4d4d4d"/>
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="10" r="6.5" fill="#8d8d8d"/>
              <rect x="9" y="16" width="6" height="5" rx="1.5" fill="#6c6c6d"/>
              <rect x="11" y="21" width="2" height="1.2" rx="0.6" fill="#4d4d4d"/>
            </svg>
          )}
        </button>

        {/* Mailto Button */}
        <button 
          onClick={() => window.location.href = 'mailto:jan.peiro@protonmail.com'}
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="#8d8d8d"/>
            <polygon points="2,5 12,15 22,5" fill="#6c6c6d"/>
          </svg>
        </button>

        {/* Impressum Button */}
        <button 
          onClick={() => window.open('https://www.jopl.de/2/impressum.html', '_blank')}
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="34" height="34" viewBox="240 130 40 40" xmlns="http://www.w3.org/2000/svg">
            <style>{`.st0{fill:#9d9d9d;}`}</style>
            <g>
              <rect x="249.92" y="134.48" className="st0" width="1.66" height="8.52"/>
              <polygon className="st0" points="259.51,142.05 261.08,136.95 261.08,143 262.54,143 262.54,134.48 260.42,134.48 258.8,140.22 
                257.17,134.48 255.06,134.48 255.06,143 256.52,143 256.52,137.06 258.09,142.05"/>
              <path className="st0" d="M267.73,139.7c2.06,0.05,4.41,0.15,4.49-2.61c-0.09-2.95-2.74-2.64-4.89-2.61h-1.2V143h1.61V139.7z
                 M267.73,136.03c0.81,0,1.85,0,1.85,0c0.6-0.02,0.99,0.49,0.97,1.07c0.02,0.57-0.39,1.07-0.97,1.05h-1.85V136.03z"/>
              <path className="st0" d="M256.03,148.03c0.05-1.39-0.93-2.59-2.36-2.55h-2.13h-0.97h-0.64v8.53h1.61v-3.43c0.31,0,0.65,0,0.97,0
                l1.92,3.43h1.95l-2.04-3.52C255.39,150.2,256.07,149.19,256.03,148.03z M253.54,149.03h-2v-2c0.88,0,2,0,2,0
                c0.55-0.01,0.85,0.49,0.83,1C254.38,148.54,254.08,149.04,253.54,149.03z"/>
              <polygon className="st0" points="259.08,145.49 258.5,145.49 258.5,154.01 259.08,154.01 260.11,154.01 264.21,154.01 264.21,152.46 
                260.11,152.46 260.11,150.55 263.57,150.55 263.57,149 260.11,149 260.11,147.03 264.21,147.03 264.21,145.49 260.11,145.49"/>
              <path className="st0" d="M271.96,152.9c0.5-0.7,0.51-2.12,0.02-2.77c-0.57-0.77-1.29-0.89-2.26-1.11c-0.05-0.01-0.09-0.02-0.13-0.03
                c-0.03-0.01-0.06-0.01-0.09-0.02c-0.62-0.15-0.99-0.15-1.39-0.52c-0.33-0.34-0.28-1.03,0.19-1.27c0.91-0.51,2.33-0.17,3.2,0.47
                l0.68-1.36c-1.89-1.44-5.93-1.29-5.88,1.72c-0.06,1.75,1.25,2.3,2.77,2.49l0.13,0.02c0.02,0.01,0.04,0,0.06,0.01
                c0.54,0.1,0.95,0.12,1.3,0.46c0.34,0.36,0.22,1.05-0.24,1.3c-1.04,0.56-2.76,0.2-3.68-0.58l-0.74,1.32
                c0.57,0.47,1.28,0.78,2.01,0.93C269.31,154.25,271.14,154.13,271.96,152.9z"/>
                <path className="st0" d="M253.24,160.03c-0.05-0.01-0.09-0.02-0.13-0.03c-0.03-0.01-0.06-0.01-0.09-0.02
          c-0.62-0.15-0.99-0.15-1.39-0.52c-0.33-0.34-0.28-1.03,0.19-1.27c0.91-0.51,2.33-0.17,3.2,0.47l0.68-1.36
          c-1.89-1.44-5.93-1.29-5.88,1.72c-0.06,1.75,1.25,2.3,2.77,2.49l0.13,0.02c0.02,0.01,0.04,0,0.06,0.01c0.54,0.1,0.95,0.12,1.3,0.46
          c0.34,0.36,0.22,1.05-0.24,1.3c-1.04,0.56-2.76,0.2-3.68-0.58l-0.74,1.32c0.57,0.47,1.28,0.78,2.01,0.93
          c1.41,0.28,3.23,0.16,4.06-1.07c0.5-0.7,0.51-2.12,0.02-2.77C254.93,160.37,254.21,160.24,253.24,160.03z"/>
          <path className="st0" d="M261.59,161.97c0.01,0.96-0.55,1.55-1.51,1.54c-0.96,0.01-1.51-0.58-1.5-1.54v-5.48h-1.61v5.44
          c0,1.2,0.39,2.24,1.42,2.8c1.39,0.71,3.7,0.46,4.43-1.08c0.24-0.47,0.37-1.05,0.37-1.71v-5.44h-1.61V161.97z"/>
          <polygon className="st0" points="268.58,162.24 266.95,156.49 264.84,156.49 264.84,165.01 266.3,165.01 266.3,159.08 267.87,164.06 
            269.29,164.06 270.86,158.96 270.86,165.01 272.31,165.01 272.31,156.49 270.2,156.49 	"/>
            </g>
          </svg>
        </button>

        {/* Logo */}
        <div style={{
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'center',
          marginLeft: '-3px'
        }}>
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            style={{
              width: '60px',
              height: 'auto',
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'
            }}
          />
        </div>
      </div>
    </ThemeContext.Provider>

  );
}
