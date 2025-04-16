'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Scene2').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      Loading 3D Scene...
    </div>
  )
})

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <Scene />
    </main>
  )
}