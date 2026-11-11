import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useInteraction } from './InteractionContext'

interface InteractionManagerProps {
  onHoverChange: (label: string | null) => void
}

const raycaster = new THREE.Raycaster()
const center = new THREE.Vector2(0, 0)

export default function InteractionManager({ onHoverChange }: InteractionManagerProps) {
  const { camera, gl } = useThree()
  const { getAll } = useInteraction()
  const targetRef = useRef<(() => void) | null>(null)
  const lastLabelRef = useRef<string | null>(null)

  useFrame(() => {
    raycaster.setFromCamera(center, camera)
    const items = getAll().filter((i) => i.enabled)
    const objects = items.map((i) => i.object)
    const hits = raycaster.intersectObjects(objects, true)

    let found: { label: string; onInteract: () => void } | null = null
    for (const hit of hits) {
      let obj: THREE.Object3D | null = hit.object
      while (obj) {
        const item = items.find((i) => i.object === obj)
        if (item) {
          if (hit.distance <= item.maxDistance) {
            found = { label: item.label, onInteract: item.onInteract }
          }
          break
        }
        obj = obj.parent
      }
      if (found) break
    }

    targetRef.current = found ? found.onInteract : null
    const nextLabel = found ? found.label : null
    if (nextLabel !== lastLabelRef.current) {
      lastLabelRef.current = nextLabel
      onHoverChange(nextLabel)
    }
  })

  useEffect(() => {
    function handleClick() {
      if (document.pointerLockElement !== gl.domElement) return
      targetRef.current?.()
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [gl])

  return null
}
