'use client'
import Cube from './Cube'

// Configuration for each cube in the grid
const cubeConfigs = [
  {
    id: 1,
    position: [-3, 0, -3],
    topLeftText: "TRUST THE FLOW",
    bottomRightText: "BE PRESENT",
    onClick: () => console.log("Cube 1 clicked")
  },
  {
    id: 2,
    position: [0, 0, -3],
    topLeftText: "EMBRACE CHANGE",
    bottomRightText: "STAY FOCUSED",
    onClick: () => console.log("Cube 2 clicked")
  },
  {
    id: 3,
    position: [3, 0, -3],
    topLeftText: "FIND BALANCE",
    bottomRightText: "STAY GROUNDED",
    onClick: () => console.log("Cube 3 clicked")
  },
  {
    id: 4,
    position: [-3, 0, 0],
    topLeftText: "SEEK CLARITY",
    bottomRightText: "TRUST YOUR PATH",
    onClick: () => console.log("Cube 4 clicked")
  },
  {
    id: 5,
    position: [0, 0, 0],
    topLeftText: "STAY PRESENT",
    bottomRightText: "BE MINDFUL",
    onClick: () => console.log("Cube 5 clicked")
  },
  {
    id: 6,
    position: [3, 0, 0],
    topLeftText: "EMBRACE GROWTH",
    bottomRightText: "KEEP LEARNING",
    onClick: () => console.log("Cube 6 clicked")
  },
  {
    id: 7,
    position: [-3, 0, 3],
    topLeftText: "FIND JOY",
    bottomRightText: "SPREAD LIGHT",
    onClick: () => console.log("Cube 7 clicked")
  },
  {
    id: 8,
    position: [0, 0, 3],
    topLeftText: "STAY TRUE",
    bottomRightText: "BE AUTHENTIC",
    onClick: () => console.log("Cube 8 clicked")
  },
  {
    id: 9,
    position: [3, 0, 3],
    topLeftText: "KEEP MOVING",
    bottomRightText: "STAY STRONG",
    onClick: () => console.log("Cube 9 clicked")
  }
]

export default function CubeGrid() {
  return (
    <>
      {cubeConfigs.map((config) => (
        <group key={config.id} position={config.position}>
          <Cube 
            topLeftText={config.topLeftText}
            bottomRightText={config.bottomRightText}
            onClick={config.onClick}
          />
        </group>
      ))}
    </>
  )
} 