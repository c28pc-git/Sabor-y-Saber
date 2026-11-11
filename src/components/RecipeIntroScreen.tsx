import type { KitchenItem, Recipe } from '../types/game'

interface RecipeIntroScreenProps {
  recipe: Recipe
  items: Record<string, KitchenItem>
  onGoToKitchen: () => void
}

export default function RecipeIntroScreen({
  recipe,
  items,
  onGoToKitchen,
}: RecipeIntroScreenProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-stone-800">
        {recipe.emoji} {recipe.name}
      </h2>
      <p className="mt-0 text-stone-500">{recipe.description}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-5">
        <div className="max-w-sm min-w-[280px] flex-1 rounded-2xl bg-white p-5 text-left shadow-md">
          <h3 className="mt-0 text-stone-800">🧾 Ingredientes y materiales</h3>
          <ul className="m-0 flex flex-wrap gap-2 p-0">
            {recipe.itemIds.map((id) => (
              <li
                key={id}
                className="list-none rounded-full bg-stone-100 px-3 py-1.5 text-sm"
              >
                {items[id].emoji} {items[id].name}
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-sm min-w-[280px] flex-1 rounded-2xl bg-white p-5 text-left shadow-md">
          <h3 className="mt-0 text-stone-800">📋 Pasos de la receta</h3>
          <ol className="m-0 pl-5 text-sm leading-relaxed text-stone-700">
            {recipe.steps.map((step, i) => (
              <li key={i} className="mb-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-sm text-stone-500">
        En la cocina busca estos ingredientes y materiales en el estante.
        Responde bien las preguntas para desbloquearlos, ponlos en el bol y
        lleva el bol a la cocina.
      </p>

      <button
        type="button"
        onClick={onGoToKitchen}
        className="mt-6 rounded-full bg-orange-500 px-9 py-3.5 text-lg font-bold text-white shadow transition hover:bg-orange-600"
      >
        🍳 Ir a la cocina
      </button>
    </section>
  )
}
