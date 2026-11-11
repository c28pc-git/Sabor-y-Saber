import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import Experience from '../three/Experience'
import type { KitchenItem, Recipe } from '../types/game'

interface Kitchen3DScreenProps {
  recipe: Recipe
  items: Record<string, KitchenItem>
  requiredIds: Set<string>
  unlockedIds: Set<string>
  bowlIds: Set<string>
  cooking: boolean
  isModalOpen: boolean
  onOpenPantry: () => void
  onDeposit: () => void
  onCook: () => void
}

export default function Kitchen3DScreen({
  recipe,
  items,
  requiredIds,
  unlockedIds,
  bowlIds,
  cooking,
  isModalOpen,
  onOpenPantry,
  onDeposit,
  onCook,
}: Kitchen3DScreenProps) {
  const [locked, setLocked] = useState(false)
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)

  useEffect(() => {
    if (isModalOpen && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [isModalOpen])

  const foundCount = unlockedIds.size + bowlIds.size
  const remaining = Math.max(requiredIds.size - foundCount, 0)
  const progressPct = requiredIds.size
    ? Math.round((foundCount / requiredIds.size) * 100)
    : 0
  const bowlFull = requiredIds.size > 0 && bowlIds.size === requiredIds.size

  let banner = 'Ve a la alacena y haz clic para ver qué necesitas.'
  if (bowlFull) banner = '¡Bol listo! Mira la cocina y haz clic para cocinar.'
  else if (unlockedIds.size > 0) banner = 'Ve a la mesa y haz clic para echar lo que llevas al bol.'

  return (
    <div id="kitchen-3d-root" className="relative h-full w-full overflow-hidden bg-black">
      <Canvas camera={{ fov: 75, position: [0, 1.6, 4] }} shadows="soft">
        <Experience
          items={items}
          requiredIds={requiredIds}
          unlockedIds={unlockedIds}
          bowlIds={bowlIds}
          cooking={cooking}
          onOpenPantry={onOpenPantry}
          onDeposit={onDeposit}
          onCook={onCook}
          onHoverChange={setHoverLabel}
          onLock={() => setLocked(true)}
          onUnlock={() => setLocked(false)}
        />
      </Canvas>

      {/* top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 p-3">
        <div className="rounded-full bg-black/55 px-4 py-1.5 text-sm text-white">
          {recipe.emoji} {recipe.name} · {banner}
        </div>
        <div className="flex items-center gap-3 rounded-full bg-black/55 px-4 py-1.5 text-sm text-white">
          <span>🎯 {remaining} por encontrar</span>
          <div className="h-2 w-36 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* crosshair + hover prompt */}
      {locked && !isModalOpen && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-white/80" />
          {hoverLabel && (
            <div className="mt-20 rounded-md bg-black/65 px-3 py-1 text-xs text-white">
              {hoverLabel} · clic para interactuar
            </div>
          )}
        </div>
      )}

      {/* click to play overlay */}
      {!locked && !isModalOpen && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center text-white">
          <div className="text-4xl">🖱️</div>
          <p className="mt-2 max-w-xs text-sm">
            Haz clic en la cocina para entrar en primera persona.
            <br />
            WASD para moverte, ratón para mirar, clic para interactuar.
          </p>
        </div>
      )}
    </div>
  )
}
