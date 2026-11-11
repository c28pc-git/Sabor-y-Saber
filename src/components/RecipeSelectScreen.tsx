import type { Recipe } from '../types/game'

interface RecipeSelectScreenProps {
  recipes: Recipe[]
  selectedId: string | null
  onSelect: (id: string) => void
  onStart: () => void
}

export default function RecipeSelectScreen({
  recipes,
  selectedId,
  onSelect,
  onStart,
}: RecipeSelectScreenProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-stone-800">Elige una receta</h2>
      <p className="mt-1 text-stone-500">
        Después de elegir, pulsa empezar para iniciar el cronómetro.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-md">
        <h3 className="mb-2 text-stone-800">📋 Cómo jugar</h3>
        <p className="text-sm text-stone-600">
          Primero selecciona una receta que quieras cocinar. Cuando hagas clic en el botón de
          empezar, comenzará un temporizador.
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-600">
          <li>
            Mira los ingredientes y materiales necesarios para la receta y selecciona estos
            ingredientes y materiales del estante de la cocina.
          </li>
          <li>
            Para seleccionar los ingredientes y materiales del estante, responde a las preguntas
            que aparecen en pantalla tras hacer clic en el ingrediente o material.
          </li>
          <li>
            Una vez que los ingredientes y materiales estén desbloqueados, pon todos los
            ingredientes en el bol en la isla de cocina.
          </li>
          <li>Para terminar, enciende la estufa y cocina todo.</li>
        </ol>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {recipes.map((r) => {
          const selected = r.id === selectedId
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect(r.id)}
              className={`rounded-2xl border-[3px] bg-white p-5 text-center shadow-md transition hover:-translate-y-1 ${
                selected
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-transparent'
              }`}
            >
              <div className="text-5xl">{r.emoji}</div>
              <h3 className="mt-2 mb-1 text-stone-800">{r.name}</h3>
              <p className="m-0 text-sm text-stone-500">{r.description}</p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!selectedId}
        onClick={onStart}
        className={`mt-9 rounded-full bg-emerald-500 px-9 py-3.5 text-lg font-bold text-white shadow transition ${
          selectedId
            ? 'opacity-100 hover:bg-emerald-600'
            : 'pointer-events-none opacity-40'
        }`}
      >
        ▶ Empezar
      </button>
    </section>
  )
}
