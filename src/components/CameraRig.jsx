function CameraRig({ mode }) {
  const { camera } = useThree();
  const portfolioPos = new THREE.Vector3(-5, 5, 5);
  const cockpitPos = new THREE.Vector3(0, 0, 0.5);

  useGSAP(() => {
    if (mode === 'transition') {
      gsap.to(camera.position, {
        x: cockpitPos.x,
        y: cockpitPos.y,
        z: cockpitPos.z,
        duration: 2,
        ease: "power2.inOut"
      });
      gsap.to(camera, {
        rotation: { x: 0, y: 0, z: 0 },
        duration: 2,
        ease: "power2.inOut"
      });
    } else if (mode === 'portfolio') {
      gsap.to(camera.position, {
        x: portfolioPos.x,
        y: portfolioPos.y,
        z: portfolioPos.z,
        duration: 2,
        ease: "power2.inOut"
      });
    }
  }, [mode]);

  return null;
}