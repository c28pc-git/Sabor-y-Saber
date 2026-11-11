import { Html, RoundedBox } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type * as THREE from 'three'
import { createWoodTexture } from './textures'
import { useInteractable } from './useInteractable'

interface ShelfProps {
  collected: number
  required: number
  onOpenPantry: () => void
}

const JAR_COLORS = ['#e3b04b', '#c0392b', '#5b8c3a', '#7d6652', '#4a7fb5']

export default function Shelf({ collected, required, onOpenPantry }: ShelfProps) {
  const groupRef = useRef<THREE.Group>(null)
  const backTexture = useMemo(() => createWoodTexture('#6b4428', '#4f3119'), [])
  const boardTexture = useMemo(() => createWoodTexture('#9c6a3c', '#7a4e2e'), [])

  useInteractable('shelf', groupRef, {
    label: 'Abrir la alacena',
    enabled: true,
    maxDistance: 3.4,
    onInteract: onOpenPantry,
  })

  return (
    <group ref={groupRef} position={[-4.82, 0, -1.6]} rotation={[0, Math.PI / 2, 0]}>
      {/* back panel */}
      <RoundedBox args={[2.6, 2.2, 0.3]} radius={0.02} smoothness={2} position={[0, 1.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={backTexture} roughness={0.7} />
      </RoundedBox>
      {/* side panels */}
      <mesh position={[-1.3, 1.3, 0.2]} castShadow>
        <boxGeometry args={[0.08, 2.2, 0.55]} />
        <meshStandardMaterial map={backTexture} roughness={0.7} />
      </mesh>
      <mesh position={[1.3, 1.3, 0.2]} castShadow>
        <boxGeometry args={[0.08, 2.2, 0.55]} />
        <meshStandardMaterial map={backTexture} roughness={0.7} />
      </mesh>
      {/* shelf boards */}
      {[0.4, 0.95, 1.5, 2.05].map((y) => (
        <mesh key={y} position={[0, y, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.06, 0.5]} />
          <meshStandardMaterial map={boardTexture} roughness={0.5} />
        </mesh>
      ))}
      {/* jars / boxes as flavor */}
      {JAR_COLORS.map((color, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        return (
          <mesh
            key={color}
            position={[-0.75 + col * 0.75, (row ? 1.55 : 1.0), 0.18]}
            castShadow
          >
            <cylinderGeometry args={[0.15, 0.15, 0.3, 14]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
          </mesh>
        )
      })}
      {JAR_COLORS.map((color, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        return (
          <mesh
            key={`lid-${color}`}
            position={[-0.75 + col * 0.75, (row ? 1.55 : 1.0) + 0.17, 0.18]}
            castShadow
          >
            <cylinderGeometry args={[0.16, 0.16, 0.04, 14]} />
            <meshStandardMaterial color="#d9cfa8" roughness={0.6} />
          </mesh>
        )
      })}

      <Html position={[0, 2.5, 0.2]} center distanceFactor={4.5} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(0,0,0,0.55)',
            color: 'white',
            borderRadius: 8,
            padding: '2px 8px',
            fontSize: 13,
            whiteSpace: 'nowrap',
          }}
        >
          🧺 Alacena · {collected}/{required}
        </div>
      </Html>
    </group>
  )
}
