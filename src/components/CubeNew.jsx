import { useState } from 'react'
import { RoundedBox } from '@react-three/drei'
import TypewriterText from './TypewriterText'

export default function CubeNew({ 
  position = [0, 0, 0],
  topLeftText = '',
  bottomRightText = '',
  onClick,
  color = '#3d3d3d'
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <group 
      position={position}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <RoundedBox args={[2, 0.5, 2]}>
        <meshStandardMaterial color={isHovered ? 'white' : color} />
      </RoundedBox>
      
      <TypewriterText
        position={[0, 0.6, 0]}
        fontSize={0.3}
        color="red"
        speed={30}
        animate={isHovered}
      >
        {topLeftText}
      </TypewriterText>
      
      <TypewriterText
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color="white"
        speed={40}
        animate={isHovered}
      >
        {bottomRightText}
      </TypewriterText>
    </group>
  )
}