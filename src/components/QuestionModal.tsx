import { useEffect, useRef, useState } from 'react'
import type { KitchenItem } from '../types/game'

interface QuestionModalProps {
  item: KitchenItem
  onCorrect: () => void
  onWrong: () => void
  onCancel: () => void
}

const WRONG_COOLDOWN_SECONDS = 3

export default function QuestionModal({
  item,
  onCorrect,
  onWrong,
  onCancel,
}: QuestionModalProps) {
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [cooldown, setCooldown] = useState(0)
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current)
    }
  }, [])

  function handleChoose(idx: number) {
    if (status !== 'idle') return
    setChosenIndex(idx)
    if (idx === item.correctIndex) {
      setStatus('correct')
      setTimeout(onCorrect, 400)
    } else {
      setStatus('wrong')
      onWrong()
      setCooldown(WRONG_COOLDOWN_SECONDS)
      cooldownTimer.current = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            if (cooldownTimer.current) clearInterval(cooldownTimer.current)
            setStatus('idle')
            setChosenIndex(null)
            return 0
          }
          return c - 1
        })
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
        <div className="text-4xl">{item.emoji}</div>
        <h3 className="mt-2 mb-4 text-stone-800">{item.question}</h3>
        <div>
          {item.options?.map((opt, idx) => {
            let stateClasses = 'bg-stone-100 hover:bg-stone-200'
            if (status !== 'idle' && idx === chosenIndex) {
              stateClasses =
                status === 'correct'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
            }
            return (
              <button
                key={idx}
                type="button"
                disabled={status !== 'idle'}
                onClick={() => handleChoose(idx)}
                className={`mb-2 block w-full rounded-lg border-2 border-transparent px-3 py-3 text-left transition disabled:cursor-not-allowed ${stateClasses}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {status === 'wrong' && (
          <p className="mt-1 text-sm font-semibold text-red-500">
            ❌ Incorrecto. Espera {cooldown}s para volver a intentar…
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 bg-none text-stone-400 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
