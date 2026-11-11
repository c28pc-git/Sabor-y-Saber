import type { KitchenItem, Recipe } from '../types/game'

interface PantryModalProps {
  recipe: Recipe
  items: Record<string, KitchenItem>
  shelfOrder: string[]
  requiredIds: Set<string>
  unlockedIds: Set<string>
  bowlIds: Set<string>
  shakingId: string | null
  onItemClick: (id: string) => void
  onClose: () => void
}

export default function PantryModal({
  recipe,
  items,
  shelfOrder,
  requiredIds,
  unlockedIds,
  bowlIds,
  shakingId,
  onItemClick,
  onClose,
}: PantryModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-5">
      <div className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#fff8f0] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-xl text-stone-400 hover:text-stone-600"
        >
          ✕
        </button>
        <h3 className="mt-0 text-center text-stone-800">🧺 Alacena</h3>

        <details className="mb-4 rounded-lg bg-white p-3">
          <summary className="cursor-pointer font-bold text-stone-700">📖 Ver receta</summary>
          <div className="mt-2.5 text-sm">
            <p>
              <b>
                {recipe.emoji} {recipe.name}
              </b>{' '}
              — {recipe.description}
            </p>
            <p className="mb-1 font-bold">Ingredientes y materiales:</p>
            <ul className="m-0 mb-2 pl-5">
              {recipe.itemIds.map((id) => (
                <li key={id}>
                  {items[id].emoji} {items[id].name}
                </li>
              ))}
            </ul>
            <p className="mb-1 font-bold">Pasos:</p>
            <ol className="m-0 pl-5">
              {recipe.steps.map((step, i) => (
                <li key={i} className="mb-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </details>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {shelfOrder.map((id) => {
            const item = items[id]
            const unlocked = unlockedIds.has(id) || bowlIds.has(id)
            const isShaking = shakingId === id
            return (
              <button
                key={id}
                type="button"
                disabled={unlocked}
                onClick={() => onItemClick(id)}
                className={`relative flex flex-col items-center rounded-xl bg-white px-1 py-2.5 shadow-md transition ${
                  unlocked
                    ? 'opacity-40'
                    : 'cursor-pointer hover:-translate-y-1'
                } ${isShaking ? 'animate-shake' : ''}`}
              >
                {unlocked && (
                  <span className="absolute -top-1.5 -right-0.5 text-xs">✅</span>
                )}
                <span className="text-2xl">{item.emoji}</span>
                <span className="mt-1 text-center text-[11px] leading-tight text-stone-600">
                  {item.name}
                </span>
                {requiredIds.has(id) === false && (
                  <span className="sr-only">no necesario</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
