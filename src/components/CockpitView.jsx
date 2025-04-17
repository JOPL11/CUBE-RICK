function CockpitView({ onExit }) {
  return (
    <group position={[0, 0, -1]}>
      {/* Basic cockpit mesh */}
      <mesh>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#222222" transparent opacity={0.8} />
      </mesh>
      
      {/* Exit button */}
      <mesh position={[0, -0.3, 0.5]} onClick={onExit}>
        <boxGeometry args={[0.3, 0.1, 0.01]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}