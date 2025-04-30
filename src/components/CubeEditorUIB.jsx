'use client'

import { LinkIcon } from './InteractiveCubes'

const CubeEditorUI = ({ selectedCube, cubeTexts, onClose }) => {
  if (selectedCube === null) return null

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: '#15171c',
      padding: '20px',
      borderRadius: '2px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.8)',
      zIndex: 1000,
      color: '#e0e0e0',
      width: '350px',
      maxHeight: '80vh',
      display: 'flex',
      fontFamily: 'InterDisplay-ExtraLight, sans-serif',
      flexDirection: 'column'
    }}>
      <div style={{
        marginBottom: '15px',
        fontFamily: 'InterDisplay-Bold, sans-serif'
      }}>
        <div style={{ fontSize: '1.2em' }}>
          {cubeTexts[selectedCube].topLeftText}
        </div>
        <div style={{ fontSize: '0.9em', color: '#aaa' }}>
          {cubeTexts[selectedCube].bottomRightText}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '8px',
        whiteSpace: 'pre-line',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        fontFamily: 'InterDisplay-ExtraLight, sans-serif'
      }}>
        {cubeTexts[selectedCube].description.split('\n\n').map((paragraph, i) => (
          <p key={i} style={{ 
            marginBottom: '1em',
            lineHeight: '1.5'
          }}>
            {paragraph}
          </p>
        ))}
      </div>

      {cubeTexts[selectedCube].videoUrl && (
        <button
          onClick={() => window.open(cubeTexts[selectedCube].videoUrl, '_blank')}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#f57500',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
          </svg>
          Watch Video
        </button>
      )}

      {cubeTexts[selectedCube].externalUrl && (
        <button
          onClick={() => window.open(cubeTexts[selectedCube].externalUrl, '_blank')}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#f57500',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LinkIcon />
          Open URL
        </button>
      )}

      <button 
        onClick={onClose}
        style={{ 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#404040',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  )
}

export default CubeEditorUI