function DotCamera({ dotRef, active }) {
    const { camera, controls } = useThree()
    const startPos = useRef(new THREE.Vector3())
    const animProgress = useRef(0)
    const isInitialized = useRef(false)
  
    useFrame((_, delta) => {
      if (!active || !dotRef.current) return
      
      const dotPos = dotRef.current.position
      const dotTarget = dotRef.current.target
  
      if (animProgress.current < 1) {
        animProgress.current += delta * 2 // 0.5 second transition
        camera.position.lerpVectors(startPos.current, dotPos, animProgress.current)
      } else {
        camera.position.copy(dotPos)
      }
      
      // Smooth look-at with movement anticipation
      const lookAtTarget = new THREE.Vector3().lerpVectors(dotPos, dotTarget, 0.3)
      camera.lookAt(lookAtTarget)
    })
  
    useEffect(() => {
      if (active) {
        startPos.current.copy(camera.position)
        animProgress.current = 0
        if (controls) controls.enabled = false
        isInitialized.current = true
      } else if (isInitialized.current) {
        if (controls) controls.enabled = true
      }
    }, [active])
  
    return null
  }
  