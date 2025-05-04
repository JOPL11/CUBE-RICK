'use client'

export default function VideoPlayer({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000,
      backgroundColor: 'rgba(0,0,0,0.95)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Container that will hold video later */}
      <div style={{
        width: '80%',
        height: '80%',
        backgroundColor: '#000',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            background: '#f57500',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 3
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  )
}
