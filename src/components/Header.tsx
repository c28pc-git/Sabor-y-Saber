interface HeaderProps {
  recipeLabel: string | null
  elapsedMs: number
  mistakes: number
  onReset: () => void
}

export default function Header({
  recipeLabel,
  elapsedMs,
  mistakes,
  onReset,
}: HeaderProps) {
  const totalSec = Math.floor(elapsedMs / 1000)
  const m = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, '0')
  const s = (totalSec % 60).toString().padStart(2, '0')

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-900 to-amber-800 px-5 py-3.5 text-amber-50 shadow-md">
      <h1 className="m-0 text-lg font-bold tracking-wide">🍳 Trivia de Cocina</h1>
      {recipeLabel && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1.5">{recipeLabel}</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            ⏱ {m}:{s}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">❌ {mistakes}</span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-orange-500 px-3.5 py-1.5 font-bold text-white transition hover:bg-orange-600"
          >
            🔁 Reiniciar
          </button>
        </div>
      )}
    </header>
  )
}
