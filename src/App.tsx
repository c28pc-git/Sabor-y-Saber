import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Kitchen3DScreen from './components/Kitchen3DScreen'
import PantryModal from './components/PantryModal'
import QuestionModal from './components/QuestionModal'
import RecapScreen from './components/RecapScreen'
import RecipeIntroScreen from './components/RecipeIntroScreen'
import RecipeSelectScreen from './components/RecipeSelectScreen'
import Toast from './components/Toast'
import { DECOY_IDS, ITEMS } from './data/items'
import { RECIPES } from './data/recipes'
import type { Recipe, ScreenId } from './types/game'
import { shuffle } from './utils'

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('select')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)

  const [requiredIds, setRequiredIds] = useState<Set<string>>(new Set())
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [bowlIds, setBowlIds] = useState<Set<string>>(new Set())
  const [shelfOrder, setShelfOrder] = useState<string[]>([])

  const [mistakes, setMistakes] = useState(0)
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const [finishTimestamp, setFinishTimestamp] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const [activeModalItemId, setActiveModalItemId] = useState<string | null>(null)
  const [shakingId, setShakingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [cooking, setCooking] = useState(false)
  const [pantryOpen, setPantryOpen] = useState(false)

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (screen !== 'intro' && screen !== 'kitchen') return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [screen])

  function showToast(message: string) {
    setToastMessage(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMessage(null), 2200)
  }

  function handleSelectRecipe(id: string) {
    setSelectedRecipeId(id)
  }

  function handleStartEmpezar() {
    const recipe = RECIPES.find((r) => r.id === selectedRecipeId)
    if (!recipe) return
    setCurrentRecipe(recipe)
    setRequiredIds(new Set(recipe.itemIds))
    setUnlockedIds(new Set())
    setBowlIds(new Set())
    setMistakes(0)
    setCooking(false)
    const t = Date.now()
    setStartTimestamp(t)
    setNow(t)
    setFinishTimestamp(null)
    setScreen('intro')
  }

  function handleGoToKitchen() {
    if (!currentRecipe) return
    setShelfOrder(shuffle([...currentRecipe.itemIds, ...DECOY_IDS]))
    setScreen('kitchen')
  }

  function handleShelfItemClick(id: string) {
    if (!requiredIds.has(id)) {
      showToast('🚫 Ese no lo necesitas para esta receta')
      setShakingId(id)
      setTimeout(() => setShakingId(null), 400)
      return
    }
    setActiveModalItemId(id)
  }

  function handleModalCorrect() {
    const id = activeModalItemId
    if (!id) return
    setUnlockedIds((prev) => {
      const next = new Set(prev).add(id)
      if (next.size + bowlIds.size === requiredIds.size) {
        setPantryOpen(false)
      }
      return next
    })
    setActiveModalItemId(null)
    showToast(`✅ ¡Correcto! ${ITEMS[id].name} desbloqueado`)
  }

  function handleModalWrong() {
    setMistakes((m) => m + 1)
  }

  function handleOpenPantry() {
    setPantryOpen(true)
  }

  function handlePantryClose() {
    setPantryOpen(false)
  }

  function handleDepositAll() {
    if (unlockedIds.size === 0) return
    setBowlIds((prev) => new Set([...prev, ...unlockedIds]))
    setUnlockedIds(new Set())
    showToast('🥣 Ingredientes añadidos al bol')
  }

  function handleCookClick() {
    setCooking(true)
    showToast('🔥 ¡Cocinando la receta!')
    setTimeout(() => {
      const finish = Date.now()
      setFinishTimestamp(finish)
      setScreen('recap')
    }, 2400)
  }

  function handleReset() {
    setScreen('select')
    setSelectedRecipeId(null)
    setCurrentRecipe(null)
    setRequiredIds(new Set())
    setUnlockedIds(new Set())
    setBowlIds(new Set())
    setShelfOrder([])
    setMistakes(0)
    setStartTimestamp(null)
    setFinishTimestamp(null)
    setActiveModalItemId(null)
    setShakingId(null)
    setCooking(false)
    setPantryOpen(false)
  }

  const elapsedMs = startTimestamp
    ? (finishTimestamp ?? now) - startTimestamp
    : 0

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-orange-50 to-amber-100">
      <Header
        recipeLabel={
          currentRecipe ? `${currentRecipe.emoji} ${currentRecipe.name}` : null
        }
        elapsedMs={elapsedMs}
        mistakes={mistakes}
        onReset={handleReset}
      />

      <main className={screen === 'kitchen' ? 'min-h-0 flex-1' : 'flex-1 overflow-y-auto'}>
        {screen === 'select' && (
          <RecipeSelectScreen
            recipes={RECIPES}
            selectedId={selectedRecipeId}
            onSelect={handleSelectRecipe}
            onStart={handleStartEmpezar}
          />
        )}

        {screen === 'intro' && currentRecipe && (
          <RecipeIntroScreen
            recipe={currentRecipe}
            items={ITEMS}
            onGoToKitchen={handleGoToKitchen}
          />
        )}

        {screen === 'kitchen' && currentRecipe && (
          <Kitchen3DScreen
            recipe={currentRecipe}
            items={ITEMS}
            requiredIds={requiredIds}
            unlockedIds={unlockedIds}
            bowlIds={bowlIds}
            cooking={cooking}
            isModalOpen={activeModalItemId !== null || pantryOpen}
            onOpenPantry={handleOpenPantry}
            onDeposit={handleDepositAll}
            onCook={handleCookClick}
          />
        )}

        {screen === 'recap' && currentRecipe && (
          <RecapScreen
            recipe={currentRecipe}
            elapsedMs={elapsedMs}
            mistakes={mistakes}
            onPlayAgain={handleReset}
          />
        )}
      </main>

      {pantryOpen && currentRecipe && (
        <PantryModal
          recipe={currentRecipe}
          items={ITEMS}
          shelfOrder={shelfOrder}
          requiredIds={requiredIds}
          unlockedIds={unlockedIds}
          bowlIds={bowlIds}
          shakingId={shakingId}
          onItemClick={handleShelfItemClick}
          onClose={handlePantryClose}
        />
      )}

      {activeModalItemId && (
        <QuestionModal
          item={ITEMS[activeModalItemId]}
          onCorrect={handleModalCorrect}
          onWrong={handleModalWrong}
          onCancel={() => setActiveModalItemId(null)}
        />
      )}

      <Toast message={toastMessage} />
    </div>
  )
}
