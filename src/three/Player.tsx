import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const EYE_HEIGHT = 1.6
const SPEED = 3.4
const BOUND = 4.3
const ISLAND_CENTER = new THREE.Vector2(0, -1)
const ISLAND_RADIUS = 1.5

interface PlayerProps {
  onLock: () => void
  onUnlock: () => void
}

export default function Player({ onLock, onUnlock }: PlayerProps) {
  const { camera, gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 4)
  }, [camera])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    if (document.pointerLockElement !== gl.domElement) return

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()

    const move = new THREE.Vector3()
    if (keys.current['KeyW']) move.add(forward)
    if (keys.current['KeyS']) move.sub(forward)
    if (keys.current['KeyD']) move.add(right)
    if (keys.current['KeyA']) move.sub(right)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * Math.min(delta, 0.05))
      camera.position.add(move)
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -BOUND, BOUND)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -BOUND, BOUND)

    const dx = camera.position.x - ISLAND_CENTER.x
    const dz = camera.position.z - ISLAND_CENTER.y
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < ISLAND_RADIUS && dist > 0.0001) {
      const push = ISLAND_RADIUS - dist
      camera.position.x += (dx / dist) * push
      camera.position.z += (dz / dist) * push
    }

    camera.position.y = EYE_HEIGHT
  })

  return (
    <PointerLockControls
      selector="#kitchen-3d-root"
      onLock={onLock}
      onUnlock={onUnlock}
    />
  )
}
