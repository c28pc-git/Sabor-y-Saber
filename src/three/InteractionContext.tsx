import { createContext, useCallback, useContext, useRef } from 'react'
import type { ReactNode } from 'react'
import * as THREE from 'three'

export interface Interactable {
  id: string
  object: THREE.Object3D
  label: string
  maxDistance: number
  enabled: boolean
  onInteract: () => void
}

interface InteractionApi {
  register: (item: Interactable) => void
  unregister: (id: string) => void
  getAll: () => Interactable[]
}

const InteractionCtx = createContext<InteractionApi | null>(null)

export function InteractionProvider({ children }: { children: ReactNode }) {
  const itemsRef = useRef<Map<string, Interactable>>(new Map())

  const register = useCallback((item: Interactable) => {
    itemsRef.current.set(item.id, item)
  }, [])

  const unregister = useCallback((id: string) => {
    itemsRef.current.delete(id)
  }, [])

  const getAll = useCallback(() => [...itemsRef.current.values()], [])

  return (
    <InteractionCtx.Provider value={{ register, unregister, getAll }}>
      {children}
    </InteractionCtx.Provider>
  )
}

export function useInteraction() {
  const ctx = useContext(InteractionCtx)
  if (!ctx) throw new Error('useInteraction must be used inside InteractionProvider')
  return ctx
}
