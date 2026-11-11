import type { Recipe } from '../types/game'
import { formatTime } from '../utils'

interface RecapScreenProps {
  recipe: Recipe
  elapsedMs: number
  mistakes: number
  onPlayAgain: () => void
}

export default function RecapScreen({
  recipe,
  elapsedMs,
  mistakes,
  onPlayAgain,
}: RecapScreenProps) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-stone-800">
        {recipe.emoji} {recipe.name}
      </h2>
      <p>🎉 ¡Pusiste todos los ingredientes en el bol y lo llevaste a la cocina!</p>

      <div className="mt-4 flex flex-wrap justify-center gap-5">
        <div className="rounded-xl bg-white px-5 py-3 shadow-md">
          ⏱ Tiempo: <b>{formatTime(elapsedMs)}</b>
        </div>
        <div className="rounded-xl bg-white px-5 py-3 shadow-md">
          ❌ Errores: <b>{mistakes}</b>
        </div>
      </div>

      <ol className="mx-auto mt-6 max-w-lg rounded-2xl bg-white p-6 text-left leading-relaxed shadow-md">
        {recipe.steps.map((step, i) => (
          <li key={i} className="mb-2.5">
            {step}
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={onPlayAgain}
        className="mt-7 rounded-full bg-emerald-500 px-8 py-3.5 text-lg font-bold text-white shadow transition hover:bg-emerald-600"
      >
        🔁 Jugar otra receta
      </button>
    </section>
  )
}
