import type { KitchenItem } from '../types/game'
import { InteractionProvider } from './InteractionContext'
import InteractionManager from './InteractionManager'
import Player from './Player'
import Room from './Room'
import Shelf from './Shelf'
import Stove from './Stove'
import Table from './Table'

interface ExperienceProps {
  items: Record<string, KitchenItem>
  requiredIds: Set<string>
  unlockedIds: Set<string>
  bowlIds: Set<string>
  cooking: boolean
  onOpenPantry: () => void
  onDeposit: () => void
  onCook: () => void
  onHoverChange: (label: string | null) => void
  onLock: () => void
  onUnlock: () => void
}

export default function Experience({
  items,
  requiredIds,
  unlockedIds,
  bowlIds,
  cooking,
  onOpenPantry,
  onDeposit,
  onCook,
  onHoverChange,
  onLock,
  onUnlock,
}: ExperienceProps) {
  const bowlFull = requiredIds.size > 0 && bowlIds.size === requiredIds.size
  const collected = unlockedIds.size + bowlIds.size

  return (
    <InteractionProvider>
      <hemisphereLight args={['#fff3e0', '#7a6a52', 0.5]} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.3}
        color="#fff3dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* fill light from the opposite side so no wall is left completely unlit */}
      <directionalLight position={[-3.5, 3.5, -2]} intensity={0.4} color="#dce8f5" />
      <pointLight position={[0, 2.6, -1]} intensity={0.25} />

      <Room />

      <Shelf collected={collected} required={requiredIds.size} onOpenPantry={onOpenPantry} />

      <Table
        items={items}
        unlockedIds={[...unlockedIds]}
        bowlCount={bowlIds.size}
        requiredCount={requiredIds.size}
        onDeposit={onDeposit}
      />

      <Stove ready={bowlFull} cooking={cooking} onCook={onCook} />

      <Player onLock={onLock} onUnlock={onUnlock} />
      <InteractionManager onHoverChange={onHoverChange} />
    </InteractionProvider>
  )
}
