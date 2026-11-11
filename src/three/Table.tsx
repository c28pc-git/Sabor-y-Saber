import { Html, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { KitchenItem } from '../types/game'
import { BOWL_LOCAL_POSITION, computeTableSlots } from './layout'
import { createMarbleTexture } from './textures'
import { useInteractable } from './useInteractable'

interface TableProps {
  items: Record<string, KitchenItem>
  unlockedIds: string[]
  bowlCount: number
  requiredCount: number
  onDeposit: () => void
}

interface DepositingItem {
  id: string
  emoji: string
  from: THREE.Vector3
  delay: number
  arcHeight: number
  spin: number
  sideJitter: number
  landed: boolean
}

const FLIGHT_DURATION = 0.55
const STAGGER = 0.14

export default function Table({
  items,
  unlockedIds,
  bowlCount,
  requiredCount,
  onDeposit,
}: TableProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bowlRef = useRef<THREE.Group>(null)
  const [depositing, setDepositing] = useState<DepositingItem[] | null>(null)
  const [splashes, setSplashes] = useState<string[]>([])
  const elapsedRef = useRef(0)
  const bowlPulseRef = useRef(0)
  const itemRefs = useRef(new Map<string, THREE.Group | null>())
  const onDepositRef = useRef(onDeposit)
  onDepositRef.current = onDeposit

  function spawnSplash() {
    const key = `${Math.random().toString(36).slice(2)}-${Date.now()}`
    setSplashes((prev) => [...prev, key])
    bowlPulseRef.current = 1
    setTimeout(() => {
      setSplashes((prev) => prev.filter((k) => k !== key))
    }, 500)
  }

  const topTexture = useMemo(() => {
    const t = createMarbleTexture()
    t.repeat.set(1.4, 0.8)
    return t
  }, [])

  const slots = computeTableSlots(unlockedIds.length)

  useInteractable('table', groupRef, {
    label:
      unlockedIds.length > 0
        ? `Echar ${unlockedIds.length} ingrediente(s) al bol`
        : 'Bol de la mesa',
    enabled: unlockedIds.length > 0 && !depositing,
    maxDistance: 2.6,
    onInteract: () => {
      if (depositing || unlockedIds.length === 0) return
      elapsedRef.current = 0
      setDepositing(
        unlockedIds.map((id, i) => ({
          id,
          emoji: items[id].emoji,
          from: new THREE.Vector3(...slots[i]),
          delay: i * STAGGER,
          arcHeight: 0.32 + Math.random() * 0.26,
          spin: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random()),
          sideJitter: (Math.random() - 0.5) * 0.18,
          landed: false,
        })),
      )
    },
  })

  useFrame((_, delta) => {
    if (bowlPulseRef.current > 0) {
      bowlPulseRef.current = Math.max(0, bowlPulseRef.current - delta * 4)
      const s = 1 + bowlPulseRef.current * 0.1
      bowlRef.current?.scale.setScalar(s)
    }

    if (!depositing) return
    elapsedRef.current += delta
    const bowl = new THREE.Vector3(...BOWL_LOCAL_POSITION)
    let allDone = true
    for (const d of depositing) {
      const t = THREE.MathUtils.clamp(
        (elapsedRef.current - d.delay) / FLIGHT_DURATION,
        0,
        1,
      )
      if (elapsedRef.current - d.delay < FLIGHT_DURATION) allDone = false
      const ref = itemRefs.current.get(d.id)
      if (!ref) continue
      const eased = 1 - (1 - t) ** 3
      ref.position.lerpVectors(d.from, bowl, eased)
      ref.position.y += Math.sin(eased * Math.PI) * d.arcHeight
      ref.position.x += Math.sin(eased * Math.PI) * d.sideJitter
      ref.rotation.x = eased * Math.PI * d.spin
      ref.rotation.z = eased * Math.PI * d.spin * 0.6

      let scale = 1 - eased * 0.55
      if (t > 0.86) {
        const squashT = Math.min((t - 0.86) / 0.14, 1)
        scale *= 1 - 0.35 * Math.sin(squashT * Math.PI)
      }
      ref.scale.setScalar(Math.max(scale, 0.15))

      if (t >= 1 && !d.landed) {
        d.landed = true
        spawnSplash()
      }
    }
    if (allDone) {
      setDepositing(null)
      onDepositRef.current()
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {/* island cabinet base */}
      <RoundedBox args={[2.5, 0.78, 1.36]} radius={0.02} smoothness={2} position={[0, 0.39, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e3d8c3" roughness={0.55} metalness={0.02} />
      </RoundedBox>
      {/* shaker-style recessed door panels on the front face */}
      {[-0.78, -0.26, 0.26, 0.78].map((x) => (
        <mesh key={x} position={[x, 0.39, 0.685]} castShadow>
          <boxGeometry args={[0.42, 0.56, 0.02]} />
          <meshStandardMaterial color="#d6c9ae" roughness={0.6} metalness={0.02} />
        </mesh>
      ))}
      {/* brushed brass toe-kick trim */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[2.5, 0.08, 1.36]} />
        <meshStandardMaterial color="#2b2622" roughness={0.6} />
      </mesh>

      {/* glossy stone countertop, slightly overhanging the cabinet */}
      <RoundedBox args={[2.62, 0.08, 1.46]} radius={0.015} smoothness={3} position={[0, 0.82, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={topTexture} roughness={0.18} metalness={0.08} envMapIntensity={1.2} />
      </RoundedBox>

      {/* bowl */}
      <group ref={bowlRef} position={[0, 0.94, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.34, 0.26, 28]} />
          <meshStandardMaterial color="#f4f4f4" roughness={0.25} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.03, 28]} />
          <meshStandardMaterial color="#dfe2e6" roughness={0.3} side={THREE.BackSide} />
        </mesh>
      </group>

      {splashes.map((key) => (
        <Html key={key} position={BOWL_LOCAL_POSITION} center distanceFactor={3.5} style={{ pointerEvents: 'none' }}>
          <div className="animate-splash" style={{ fontSize: 24 }}>
            ✨
          </div>
        </Html>
      ))}

      {!depositing &&
        unlockedIds.map((id, i) => (
          <Html
            key={id}
            position={slots[i]}
            center
            distanceFactor={3.2}
            style={{ pointerEvents: 'none' }}
          >
            <div style={{ fontSize: 26 }}>{items[id].emoji}</div>
          </Html>
        ))}

      {depositing &&
        depositing.map((d) => (
          <group
            key={d.id}
            ref={(ref) => {
              itemRefs.current.set(d.id, ref)
              if (ref) ref.position.copy(d.from)
            }}
          >
            <Html center distanceFactor={3.2} style={{ pointerEvents: 'none' }}>
              <div style={{ fontSize: 26 }}>{d.emoji}</div>
            </Html>
          </group>
        ))}

      <Html position={[0, 1.4, 0]} center distanceFactor={4.5} style={{ pointerEvents: 'none' }}>
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
          🥣 {bowlCount}/{requiredCount}
        </div>
      </Html>
    </group>
  )
}
