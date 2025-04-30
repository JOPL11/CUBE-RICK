'use client'

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { theme } from '../config/theme';

export default function BackgroundColor({ darkMode }) {
  const { gl } = useThree();
  
  useEffect(() => {
    gl.setClearColor(darkMode ? theme.dark.sceneBackground : theme.light.sceneBackground);
  }, [darkMode, gl]);

  return null;
}
