import { Html, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createBrushedMetalTexture } from './textures'
import { useInteractable } from './useInteractable'

const STEAM_PUFFS = [
  { left: -8, delay: 0 },
  { left: 4, delay: 0.5 },
  { left: -2, delay: 1.0 },
  { left: 9, delay: 1.5 },
]

const BUBBLES: [number, number, number][] = [
  [-0.07, 0.03, 0.02],
  [0.05, 0.02, -0.04],
  [0, 0.04, 0.06],
  [0.08, 0.025, 0.03],
]

interface StoveProps {
  ready: boolean
  cooking: boolean
  onCook: () => void
}

export default function Stove({ ready, cooking, onCook }: StoveProps) {
  const groupRef = useRef<THREE.Group>(null)
  const flameMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const flameLightRef = useRef<THREE.PointLight>(null)
  const soupRef = useRef<THREE.Mesh>(null)
  const potRef = useRef<THREE.Group>(null)
  const metalTexture = useMemo(() => createBrushedMetalTexture(), [])

  useInteractable('stove', groupRef, {
    label: 'Poner el bol en la cocina',
    enabled: ready && !cooking,
    maxDistance: 3,
    onInteract: onCook,
  })

  useFrame((state) => {
    if (!cooking) return
    const t = state.clock.elapsedTime
    const flicker = 1 + Math.sin(t * 18) * 0.15 + Math.sin(t * 41) * 0.08
    if (flameMatRef.current) flameMatRef.current.emissiveIntensity = 1.1 * flicker
    if (flameLightRef.current) flameLightRef.current.intensity = 1.2 * flicker
    if (soupRef.current) {
      soupRef.current.position.y = 0.13 + Math.sin(t * 5) * 0.012
      soupRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.015)
    }
    if (potRef.current) {
      potRef.current.position.y = 1.02 + Math.sin(t * 2.2) * 0.004
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -4.75]}>
      {/* flanking cabinetry for a built-in look */}
      {[-1.65, 1.65].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <RoundedBox args={[1.1, 1.02, 0.68]} radius={0.02} smoothness={2} position={[0, 0.51, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#e3d8c3" roughness={0.55} metalness={0.02} />
          </RoundedBox>
          <mesh position={[0, 0.51, 0.35]} castShadow>
            <boxGeometry args={[0.85, 0.78, 0.02]} />
            <meshStandardMaterial color="#d6c9ae" roughness={0.6} metalness={0.02} />
          </mesh>
          <mesh position={[x > 0 ? -0.4 : 0.4, 0.51, 0.37]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 10]} />
            <meshStandardMaterial color="#2b2622" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* stainless range hood, mounted on the wall above the stove */}
      <group position={[0, 1.95, -0.22]}>
        <RoundedBox args={[1.9, 0.5, 0.55]} radius={0.03} smoothness={2} position={[0, 0.3, 0]} castShadow receiveShadow>
          <meshStandardMaterial map={metalTexture} roughness={0.3} metalness={0.8} />
        </RoundedBox>
        {/* tapered chimney duct up to the ceiling */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.5, 0.65, 4]} />
          <meshStandardMaterial map={metalTexture} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.75, 0.5]} />
          <meshStandardMaterial map={metalTexture} roughness={0.3} metalness={0.8} />
        </mesh>
        <pointLight position={[0, 0.05, 0.1]} intensity={cooking ? 0.5 : 0.25} distance={2.5} decay={2} color="#fff6e8" />
      </group>

      {/* body */}
      <RoundedBox args={[2.2, 1, 0.7]} radius={0.03} smoothness={2} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={metalTexture} roughness={0.4} metalness={0.7} />
      </RoundedBox>

      {/* oven door */}
      <mesh position={[0, 0.3, 0.37]} castShadow>
        <boxGeometry args={[1.8, 0.55, 0.03]} />
        <meshStandardMaterial color="#1f2225" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.3, 0.4]}>
        <boxGeometry args={[0.02, 0.5, 0.01]} />
        <meshStandardMaterial color="#8a8d90" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* cooktop surface */}
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[2.1, 0.04, 0.62]} />
        <meshStandardMaterial color="#141414" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* burner grates */}
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, 1.07, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.025, 8, 24]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh
            position={[0, -0.015, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.16, 0.16, 0.015, 20]} />
            <meshStandardMaterial
              ref={x === -0.55 ? flameMatRef : undefined}
              color={cooking && x === -0.55 ? '#ff6a1f' : '#1b1b1b'}
              emissive={cooking && x === -0.55 ? '#ff5500' : '#000000'}
              emissiveIntensity={cooking && x === -0.55 ? 1.1 : 0}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* control knobs */}
      <mesh position={[-0.75, 0.75, 0.37]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.1, 16]} />
        <meshStandardMaterial color="#c0392b" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.75, 0.75, 0.37]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.1, 16]} />
        <meshStandardMaterial color="#c0392b" roughness={0.4} metalness={0.3} />
      </mesh>

      {cooking && (
        <>
          <pointLight
            ref={flameLightRef}
            position={[-0.55, 1.2, 0]}
            intensity={1.2}
            color="#ff6a1f"
            distance={1.6}
            decay={2}
          />

          {/* pot with simmering soup sitting on the burner */}
          <group ref={potRef} position={[-0.55, 1.02, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.22, 24]} />
              <meshStandardMaterial color="#5c6066" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh ref={soupRef} position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.21, 0.21, 0.04, 24]} />
              <meshStandardMaterial color="#d97a3b" roughness={0.5} />
            </mesh>
            {BUBBLES.map((pos, i) => (
              <Html
                key={i}
                position={pos}
                center
                distanceFactor={4.5}
                style={{ pointerEvents: 'none' }}
              >
                <div
                  className="animate-bubble"
                  style={{ fontSize: 10, animationDelay: `${i * 0.2}s` }}
                >
                  🫧
                </div>
              </Html>
            ))}
          </group>

          {STEAM_PUFFS.map((puff, i) => (
            <Html
              key={i}
              position={[-0.55 + puff.left * 0.012, 1.3, 0]}
              center
              distanceFactor={4.5}
              style={{ pointerEvents: 'none' }}
            >
              <div
                className="animate-steam"
                style={{ fontSize: 20, animationDelay: `${puff.delay}s` }}
              >
                💨
              </div>
            </Html>
          ))}
        </>
      )}
      {ready && !cooking && (
        <Html position={[0, 1.6, 0]} center distanceFactor={4.5} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(217,119,75,0.9)',
              color: 'white',
              borderRadius: 8,
              padding: '2px 8px',
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            🔥 ¡Listo para cocinar!
          </div>
        </Html>
      )}
    </group>
  )
}
