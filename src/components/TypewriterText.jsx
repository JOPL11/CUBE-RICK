import { useEffect, useState } from 'react'
import { Text, Html } from '@react-three/drei'

export default function TypewriterText({ 
  children, 
  speed = 30,
  animate = true,
  ...props 
}) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!animate) return
    
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i <= children.length) {
        setDisplayText(children.substring(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [children, speed, animate]);

  return (
    <Html {...props}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {displayText}
      </div>
    </Html>
  );
}
