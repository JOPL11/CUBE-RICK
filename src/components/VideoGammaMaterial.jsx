import React from 'react';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Gamma-correcting shader material for video textures
const VideoGammaMaterialImpl = shaderMaterial(
  {
    map: null, // video texture
    gamma: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D map;
    uniform float gamma;
    varying vec2 vUv;
    void main() {
      vec4 texColor = texture2D(map, vUv);
      texColor.rgb = pow(texColor.rgb, vec3(1.0 / gamma));
      gl_FragColor = texColor;
    }
  `
);

// Register the material with R3F
extend({ VideoGammaMaterial: VideoGammaMaterialImpl });

const VideoGammaMaterial = React.forwardRef((props, ref) => (
  <videoGammaMaterial ref={ref} attach="material" {...props} />
));

export { VideoGammaMaterialImpl };
export default VideoGammaMaterial;
