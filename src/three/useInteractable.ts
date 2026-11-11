import { useEffect } from 'react'
import type { RefObject } from 'react'
import type * as THREE from 'three'
import { useInteraction } from './InteractionContext'

interface Options {
  label: string
  maxDistance?: number
  enabled: boolean
  onInteract: () => void
}

export function useInteractable(
  id: string,
  ref: RefObject<THREE.Object3D | null>,
  options: Options,
) {
  const { register, unregister } = useInteraction()

  useEffect(() => {
    if (!ref.current) return
    register({
      id,
      object: ref.current,
      label: options.label,
      maxDistance: options.maxDistance ?? 3,
      enabled: options.enabled,
      onInteract: options.onInteract,
    })
    return () => unregister(id)
  })

  useEffect(() => () => unregister(id), [id, unregister])
}
